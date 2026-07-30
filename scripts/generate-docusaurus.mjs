import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {load} from "cheerio";
import {
  documents,
  labRoute,
  parts,
  routeBySource,
  siteBaseUrl,
} from "../book-structure.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = path.join(root, "docs");
const generatedDir = path.join(root, "src", "generated", "book");
const staticDir = path.join(root, "static");
const basePrefix = siteBaseUrl.replace(/\/$/, "");
const searchEntries = [];

await fs.rm(docsDir, {recursive: true, force: true});
await fs.rm(generatedDir, {recursive: true, force: true});
await fs.mkdir(docsDir, {recursive: true});
await fs.mkdir(generatedDir, {recursive: true});
await fs.mkdir(path.join(staticDir, "downloads"), {recursive: true});

await fs.writeFile(path.join(staticDir, ".nojekyll"), "");
await fs.copyFile(
  path.join(root, "part6-appendices", "02-classification-latex-print.tex"),
  path.join(staticDir, "downloads", "classification-latex-print.tex"),
);

const knownSourceRoutes = new Map(
  [...routeBySource.entries()].map(([source, route]) => [
    normalizeRepoPath(source),
    route,
  ]),
);

for (const document of documents) {
  if (document.nativeMarkdown) {
    await generateNativeMarkdown(document);
  } else {
    await generateHtmlDocument(document);
  }
}

await generateRnnStandalone();
await generateLegacyRedirects();
await fs.writeFile(
  path.join(staticDir, "search-index.json"),
  `${JSON.stringify(searchEntries)}\n`,
);

console.log(
  `Generated ${documents.length} Docusaurus documents and the animated RNN lab.`,
);

async function generateNativeMarkdown(document) {
  const source = await fs.readFile(path.join(root, document.nativeMarkdown), "utf8");
  const cleanSource = source.trim().replace(/[ \t]+$/gm, "");
  const destination = path.join(docsDir, `${document.id}.mdx`);
  await fs.mkdir(path.dirname(destination), {recursive: true});
  const title = document.label.replace(/^A\.\s*/, "");
  const description =
    "A structured, interview-ready narrative for presenting enterprise AI and data science leadership.";
  const frontMatter = createFrontMatter(document, {
    title,
    description,
    hideTableOfContents: false,
  });
  await fs.writeFile(destination, `${frontMatter}\n${cleanSource}\n`);
  searchEntries.push({
    title,
    label: document.label,
    route: `${basePrefix}${document.route}`,
    part: document.partLabel,
    headings: [...cleanSource.matchAll(/^#{2,3}\s+(.+)$/gm)].map((match) =>
      match[1].replace(/[*_`]/g, "").trim(),
    ),
    description,
    text: cleanSource.replace(/[`*_>#-]/g, " ").replace(/\s+/g, " ").trim(),
  });
}

async function generateHtmlDocument(document) {
  const sourcePath = path.join(root, document.source);
  const raw = await fs.readFile(sourcePath, "utf8");
  const $ = load(raw, {decodeEntities: false});
  const title = $("title").first().text().trim() || document.label;
  const bodyClass = $("body").attr("class") || "";
  const scriptText = $("script:not([src])")
    .map((_, node) => $(node).text())
    .get()
    .join("\n");
  const normalizeMath = scriptText.includes("normalizeBackslashesInsideMath");

  if (
    document.source ===
    "part6-appendices/02-classification-latex-print.html"
  ) {
    const tex = await fs.readFile(
      path.join(root, "part6-appendices", "02-classification-latex-print.tex"),
      "utf8",
    );
    $("#tex-src").text(tex);
  }

  $("script").remove();
  $("button[data-copy], button.copy-btn").remove();

  rewriteLocalUrls($, document.source);

  const heading = $("body h1").first().text().trim() || title;
  if (document.kind !== "home") {
    $("body h1").first().remove();
  }

  const toc = assignHeadingIds($);
  const text = $("body").text().replace(/\s+/g, " ").trim();
  const description = findDescription($, text);
  const readingMinutes = Math.max(1, Math.round(wordCount(text) / 220));
  const html = $("body").html()?.trim() || "";

  const content = {
    sourcePath: document.source,
    route: document.route,
    kind: document.kind,
    partId: document.partId || "book",
    partLabel: document.partLabel || "Enterprise AI, Agents & Applied ML",
    accent: document.accent || "blue",
    heading,
    title,
    description,
    readingMinutes,
    bodyClass,
    normalizeMath,
    toc,
    html,
  };
  searchEntries.push({
    title: heading,
    label: document.label,
    route: `${basePrefix}${document.route}`,
    part: content.partLabel,
    headings: toc.map((item) => item.label),
    description,
    text,
  });

  const modulePath = path.join(generatedDir, `${document.id}.json`);
  await fs.mkdir(path.dirname(modulePath), {recursive: true});
  await fs.writeFile(modulePath, `${JSON.stringify(content, null, 2)}\n`);

  const destination = path.join(docsDir, `${document.id}.mdx`);
  await fs.mkdir(path.dirname(destination), {recursive: true});
  const importPath = `@site/src/generated/book/${document.id}.json`;
  const frontMatter = createFrontMatter(document, {
    title,
    description,
    hideTableOfContents: true,
  });
  const mdx = `${frontMatter}
import BookArticle from '@site/src/components/BookArticle';
import content from '${importPath}';

<BookArticle content={content} />
`;
  await fs.writeFile(destination, mdx);
}

function createFrontMatter(
  document,
  {title, description, hideTableOfContents},
) {
  const lines = [
    "---",
    `title: ${yamlString(title)}`,
    `slug: ${yamlString(document.route)}`,
    `description: ${yamlString(description)}`,
    `sidebar_label: ${yamlString(document.label)}`,
    `pagination_label: ${yamlString(document.label)}`,
    "hide_title: true",
    `hide_table_of_contents: ${hideTableOfContents ? "true" : "false"}`,
    "---",
  ];
  return `${lines.join("\n")}\n`;
}

function rewriteLocalUrls($, source) {
  const sourceDirectory = path.posix.dirname(source);
  $("[href], [src]").each((_, node) => {
    const attribute = $(node).attr("href") !== undefined ? "href" : "src";
    const value = ($(node).attr(attribute) || "").trim();
    if (
      !value ||
      value.startsWith("#") ||
      /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(value)
    ) {
      return;
    }

    const match = value.match(/^([^?#]*)([?#].*)?$/);
    const pathname = decodeURIComponent(match?.[1] || "");
    const suffix = match?.[2] || "";
    if (!pathname) return;

    const target = normalizeRepoPath(
      pathname.startsWith("/")
        ? pathname.slice(1)
        : path.posix.join(sourceDirectory, pathname),
    );
    const route = knownSourceRoutes.get(target);
    if (route) {
      $(node).attr(attribute, `${basePrefix}${route}${suffix}` || "/");
      return;
    }

    if (target === "part6-appendices/02-classification-latex-print.tex") {
      $(node).attr(
        attribute,
        `${basePrefix}/downloads/classification-latex-print.tex${suffix}`,
      );
      return;
    }

    if (target.startsWith("assets/")) {
      const staticAsset = target.slice("assets/".length);
      $(node).attr(attribute, `${basePrefix}/${staticAsset}${suffix}`);
    }
  });
}

function assignHeadingIds($) {
  const used = new Map();
  const toc = [];
  $("body h2, body h3").each((_, node) => {
    const label = $(node).text().replace(/\s+/g, " ").trim();
    if (!label) return;
    let id = $(node).attr("id") || slugify(label);
    const count = used.get(id) || 0;
    used.set(id, count + 1);
    if (count) id = `${id}-${count + 1}`;
    $(node).attr("id", id);
    if (node.tagName.toLowerCase() === "h2") {
      toc.push({id, label});
    }
  });
  return toc;
}

function findDescription($, fallbackText) {
  const lead = $("body p.lead").first().text().replace(/\s+/g, " ").trim();
  const firstParagraph = $("body p")
    .first()
    .text()
    .replace(/\s+/g, " ")
    .trim();
  const value = lead || firstParagraph || fallbackText;
  return value.length > 220 ? `${value.slice(0, 217).trim()}...` : value;
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function slugify(value) {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function normalizeRepoPath(value) {
  return path.posix.normalize(value.replaceAll("\\", "/")).replace(/^\.\//, "");
}

function yamlString(value) {
  return JSON.stringify(String(value).replace(/\s+/g, " ").trim());
}

async function generateRnnStandalone() {
  const sourcePath = path.join(root, labRoute.source);
  let html = await fs.readFile(sourcePath, "utf8");
  html = html
    .replaceAll("../assets/", `${basePrefix}/`)
    .replace(
      'href="10-recurrent-neural-networks.html"',
      `href="${basePrefix}/part5-deep-learning-and-llms/10-recurrent-neural-networks"`,
    );
  await fs.writeFile(
    path.join(root, "src", "generated", "rnn-standalone.json"),
    `${JSON.stringify(html)}\n`,
  );
  await fs.writeFile(
    path.join(staticDir, "labs", "rnn-standalone.html"),
    html,
  ).catch(async (error) => {
    if (error.code !== "ENOENT") throw error;
    await fs.mkdir(path.join(staticDir, "labs"), {recursive: true});
    await fs.writeFile(
      path.join(staticDir, "labs", "rnn-standalone.html"),
      html,
    );
  });
}

async function generateLegacyRedirects() {
  for (const part of parts) {
    const target = `${basePrefix}/${part.folder}/overview`;
    const destination = path.join(staticDir, part.folder, "index.html");
    await fs.mkdir(path.dirname(destination), {recursive: true});
    await fs.writeFile(destination, redirectHtml(target));
  }

  const labDestination = path.join(staticDir, labRoute.legacyRoute.slice(1));
  await fs.mkdir(path.dirname(labDestination), {recursive: true});
  await fs.writeFile(
    labDestination,
    redirectHtml(`${basePrefix}${labRoute.route}`),
  );
}

function redirectHtml(target) {
  const escaped = target.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=${escaped}">
  <link rel="canonical" href="${escaped}">
  <title>Redirecting...</title>
</head>
<body>
  <p>Continue to <a href="${escaped}">${escaped}</a>.</p>
</body>
</html>
`;
}
