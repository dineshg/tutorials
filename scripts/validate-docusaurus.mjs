import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {load} from "cheerio";
import {documents, siteBaseUrl} from "../book-structure.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = path.join(root, "build");
const errors = [];
const buildEntries = new Set(
  (await walk(buildDir)).map((file) => path.resolve(file)),
);

await validateContentPreservation();
await validateSearchIndex();
const checkedLinks = await validateBuildLinks();

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${documents.length} documents and ${checkedLinks} local build links.`,
  );
}

async function validateContentPreservation() {
  for (const document of documents) {
    const generatedDocument = path.join(root, "docs", `${document.id}.mdx`);

    if (document.nativeMarkdown) {
      const [source, generated] = await Promise.all([
        fs.readFile(path.join(root, document.nativeMarkdown), "utf8"),
        fs.readFile(generatedDocument, "utf8"),
      ]);
      const expectedMarkdown = source.trim().replace(/[ \t]+$/gm, "");
      if (!generated.includes(expectedMarkdown)) {
        errors.push(`${document.source}: native Markdown content changed`);
      }
      continue;
    }

    const raw = await fs.readFile(path.join(root, document.source), "utf8");
    const $ = load(raw, {decodeEntities: false});
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

    const expectedHeading = $("body h1").first().text().trim();
    if (document.kind !== "home") $("body h1").first().remove();
    const expected = normalizeText($("body").text());
    const content = JSON.parse(
      await fs.readFile(
        path.join(root, "src", "generated", "book", `${document.id}.json`),
        "utf8",
      ),
    );
    const generatedBody = load(`<body>${content.html}</body>`, {
      decodeEntities: false,
    });
    const actual = normalizeText(generatedBody("body").text());

    if (document.kind !== "home" && expectedHeading !== content.heading) {
      errors.push(`${document.source}: generated chapter heading changed`);
    }

    if (expected !== actual) {
      const difference = firstDifference(expected, actual);
      errors.push(
        `${document.source}: generated text differs at ${difference.index} ` +
          `(${JSON.stringify(difference.expected)} vs ${JSON.stringify(difference.actual)})`,
      );
    }
  }
}

async function validateSearchIndex() {
  const entries = JSON.parse(
    await fs.readFile(path.join(root, "static", "search-index.json"), "utf8"),
  );
  const routes = new Set(entries.map((entry) => entry.route));
  if (entries.length !== documents.length) {
    errors.push(
      `search index has ${entries.length} entries; expected ${documents.length}`,
    );
  }
  if (routes.size !== entries.length) {
    errors.push("search index contains duplicate routes");
  }
  entries.forEach((entry) => {
    if (!entry.title || !entry.route || !entry.text) {
      errors.push(`search index entry is incomplete: ${entry.route || "unknown"}`);
    }
  });
}

async function validateBuildLinks() {
  const htmlFiles = (await walk(buildDir)).filter((file) =>
    file.endsWith(".html"),
  );
  let checked = 0;

  for (const file of htmlFiles) {
    const $ = load(await fs.readFile(file, "utf8"), {decodeEntities: false});
    $("[href], [src]").each((_, node) => {
      const value = ($(node).attr("href") ?? $(node).attr("src") ?? "").trim();
      const target = resolveLocalTarget(value, file);
      if (!target) return;
      checked += 1;
      if (!targetExists(target)) {
        errors.push(
          `${path.relative(root, file)}: unresolved local target ${value}`,
        );
      }
    });
  }

  return checked;
}

function resolveLocalTarget(value, sourceFile) {
  if (
    !value ||
    value.startsWith("#") ||
    value.startsWith("//") ||
    /^(?:https?:|mailto:|tel:|data:|javascript:|blob:)/i.test(value)
  ) {
    return null;
  }

  const pathname = decodeURIComponent(value.split(/[?#]/, 1)[0]);
  if (!pathname) return null;
  if (pathname.startsWith(siteBaseUrl)) {
    return pathname.slice(siteBaseUrl.length);
  }
  if (pathname === siteBaseUrl.slice(0, -1)) return "";
  if (pathname.startsWith("/")) return null;

  const sourceRelative = path.relative(buildDir, sourceFile).replaceAll("\\", "/");
  return path.posix.normalize(
    path.posix.join(path.posix.dirname(sourceRelative), pathname),
  );
}

function targetExists(target) {
  const cleanTarget = target.replace(/^\/+/, "");
  const candidates = cleanTarget
    ? [
        path.join(buildDir, cleanTarget),
        path.join(buildDir, `${cleanTarget}.html`),
        path.join(buildDir, cleanTarget, "index.html"),
      ]
    : [path.join(buildDir, "index.html")];
  return candidates.some((candidate) => {
    try {
      return Boolean(requireStat(candidate));
    } catch {
      return false;
    }
  });
}

function requireStat(file) {
  try {
    return buildEntries.has(path.resolve(file));
  } catch {
    return false;
  }
}

async function walk(directory) {
  const files = [];
  const entries = await fs.readdir(directory, {withFileTypes: true});
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target)));
    else files.push(target);
  }
  return files;
}

function normalizeText(value) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function firstDifference(expected, actual) {
  const limit = Math.max(expected.length, actual.length);
  for (let index = 0; index < limit; index += 1) {
    if (expected[index] !== actual[index]) {
      return {
        index,
        expected: expected.slice(index, index + 40),
        actual: actual.slice(index, index + 40),
      };
    }
  }
  return {index: -1, expected: "", actual: ""};
}
