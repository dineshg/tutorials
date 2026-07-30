import React, {useEffect, useMemo, useRef} from "react";
import hljs from "highlight.js/lib/common";
import styles from "./styles.module.css";

const languageLabels = {
  bash: "Shell",
  css: "CSS",
  dockerfile: "Dockerfile",
  http: "HTTP",
  html: "HTML",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  plaintext: "Plain text",
  python: "Python",
  shell: "Shell",
  sql: "SQL",
  text: "Plain text",
  ts: "TypeScript",
  typescript: "TypeScript",
  yaml: "YAML",
};

export default function BookArticle({content}) {
  const rootRef = useRef(null);
  const contentClass = useMemo(
    () =>
      [
        "book-article",
        "tr-content",
        content.bodyClass,
        content.kind === "home" ? "book-home" : "",
      ]
        .filter(Boolean)
        .join(" "),
    [content.bodyClass, content.kind],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    if (content.normalizeMath) normalizeMathInDom(root);
    const cleanups = [
      enhanceCodeBlocks(root),
      enhanceTables(root),
      initializeDropoutDemo(root),
    ];

    let cancelled = false;
    let attempts = 0;
    const renderMath = () => {
      if (cancelled) return;
      if (window.MathJax?.typesetPromise) {
        window.MathJax.typesetClear?.([root]);
        window.MathJax.typesetPromise([root]).catch(() => {});
        return;
      }
      if (attempts++ < 50) window.setTimeout(renderMath, 100);
    };
    renderMath();

    return () => {
      cancelled = true;
      window.MathJax?.typesetClear?.([root]);
      cleanups.forEach((cleanup) => cleanup?.());
    };
  }, [content.html, content.normalizeMath]);

  return (
    <article
      className={contentClass}
      data-book-part={content.partId}
      data-book-accent={content.accent}
    >
      {content.kind !== "home" && (
        <header className={styles.articleHeader}>
          <span className={styles.partLabel}>{content.partLabel}</span>
          <h1>{content.heading}</h1>
          <div className={styles.articleMeta}>
            <span>{content.readingMinutes} min read</span>
            <span aria-hidden="true">·</span>
            <span>{content.toc.length} sections</span>
          </div>
        </header>
      )}

      {content.kind !== "home" && content.toc.length > 2 && (
        <details className={styles.chapterToc}>
          <summary>On this page</summary>
          <nav aria-label="On this page">
            {content.toc.map((item) => (
              <a href={`#${item.id}`} key={item.id}>
                {item.label}
              </a>
            ))}
          </nav>
        </details>
      )}

      <div
        ref={rootRef}
        className={styles.articleBody}
        dangerouslySetInnerHTML={{__html: content.html}}
      />
    </article>
  );
}

function enhanceCodeBlocks(root) {
  const listeners = [];
  root.querySelectorAll("pre").forEach((pre) => {
    if (pre.dataset.bookEnhanced === "true") return;
    let code = pre.querySelector(":scope > code");
    if (!code) {
      code = document.createElement("code");
      code.textContent = pre.textContent;
      pre.replaceChildren(code);
    }

    if (code.querySelector("span")) {
      code.textContent = code.textContent;
    }
    code.removeAttribute("data-highlighted");
    code.classList.remove("hljs");

    const language = detectLanguage(code, pre);
    if (language && !code.classList.contains(`language-${language}`)) {
      code.classList.add(`language-${language}`);
    }
    try {
      hljs.highlightElement(code);
    } catch {
      code.classList.add("hljs");
    }

    const shell = document.createElement("div");
    shell.className = "book-code-shell";
    const header = document.createElement("div");
    header.className = "book-code-header";
    const label = document.createElement("span");
    label.className = "book-code-language";
    label.textContent = languageLabels[language] || language.toUpperCase();
    const button = document.createElement("button");
    button.type = "button";
    button.className = "book-copy-button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code");

    const copy = async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        button.textContent = "Copied";
      } catch {
        button.textContent = "Copy failed";
      }
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1200);
    };
    button.addEventListener("click", copy);
    listeners.push(() => button.removeEventListener("click", copy));

    header.append(label, button);
    pre.before(shell);
    shell.append(header, pre);
    pre.dataset.bookEnhanced = "true";
  });
  return () => listeners.forEach((remove) => remove());
}

function detectLanguage(code, pre) {
  const classes = [...code.classList, ...pre.classList].map((name) =>
    String(name),
  );
  const explicit = classes
    .find((name) => name.startsWith("language-"))
    ?.replace("language-", "")
    .toLowerCase();
  if (explicit) return explicit;
  if (classes.includes("sql-code")) return "sql";

  const text = code.textContent.trim();
  if (/^(?:\{|\[)[\s\S]*(?:\}|\])$/.test(text)) return "json";
  if (/\b(?:def|class|from|import|print)\b/.test(text)) return "python";
  if (/^(?:curl|pip|python|npm|git|docker|gcloud)\b/m.test(text)) return "bash";
  if (/^(?:GET|POST|PUT|PATCH|DELETE)\s+\//m.test(text)) return "http";
  if (/\b(?:SELECT|INSERT|UPDATE|CREATE TABLE)\b/i.test(text)) return "sql";
  return "text";
}

function enhanceTables(root) {
  root.querySelectorAll("table").forEach((table) => {
    if (table.parentElement?.classList.contains("book-table-scroll")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "book-table-scroll";
    table.before(wrapper);
    wrapper.append(table);
  });
}

function initializeDropoutDemo(root) {
  const slider = root.querySelector("#pSlider");
  const runButton = root.querySelector("#runDropout");
  const modeButton = root.querySelector("#toggleMode");
  if (!slider || !runButton || !modeButton) return undefined;

  const pValue = root.querySelector("#pVal");
  const xOutput = root.querySelector("#xOut");
  const maskOutput = root.querySelector("#mOut");
  const yOutput = root.querySelector("#yOut");
  const scaleOutput = root.querySelector("#scaleOut");
  const modeOutput = root.querySelector("#modeOut");
  const input = Array.from({length: 12}, (_, index) => index + 1);
  let mode = "train";

  const format = (values) =>
    `[${values.map((value) => Number(value).toFixed(1)).join(", ")}]`;
  const render = () => {
    const probability = Number.parseFloat(slider.value);
    const keep = 1 - probability;
    pValue.textContent = probability.toFixed(2);
    xOutput.textContent = format(input);

    if (mode === "eval") {
      modeOutput.textContent = "eval (dropout OFF)";
      modeOutput.className = "tag ok";
      maskOutput.textContent = "[all ones]";
      scaleOutput.textContent = "scale = 1 (no scaling needed)";
      yOutput.textContent = format(input);
      return;
    }

    const mask = input.map(() => (Math.random() < keep ? 1 : 0));
    const scale = 1 / keep;
    const output = input.map((value, index) => mask[index] * value * scale);
    modeOutput.textContent = "train (random mask each forward pass)";
    modeOutput.className = "tag warn";
    maskOutput.textContent = format(mask);
    scaleOutput.textContent = `scale = 1/(1-p) = 1/${keep.toFixed(2)} = ${scale.toFixed(2)}`;
    yOutput.textContent = format(output);
  };
  const toggle = () => {
    mode = mode === "train" ? "eval" : "train";
    render();
  };

  slider.addEventListener("input", render);
  runButton.addEventListener("click", render);
  modeButton.addEventListener("click", toggle);
  render();

  return () => {
    slider.removeEventListener("input", render);
    runButton.removeEventListener("click", render);
    modeButton.removeEventListener("click", toggle);
  };
}

function normalizeMathInDom(root) {
  const ignored = new Set(["SCRIPT", "STYLE", "TEXTAREA", "PRE", "CODE"]);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.parentElement || ignored.has(node.parentElement.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return node.nodeValue?.includes("\\\\")
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    node.nodeValue = normalizeBackslashesInsideMath(node.nodeValue);
  });
}

function normalizeBackslashesInsideMath(text) {
  let output = "";
  let index = 0;
  let mode = null;
  const escaped = (position) => {
    let count = 0;
    for (let cursor = position - 1; cursor >= 0 && text[cursor] === "\\"; cursor--) {
      count += 1;
    }
    return count % 2 === 1;
  };

  while (index < text.length) {
    if (mode === null) {
      if (text.startsWith("$$", index)) {
        mode = "display";
        output += "$$";
        index += 2;
        continue;
      }
      if (text[index] === "$" && !escaped(index)) {
        mode = "inline";
        output += "$";
        index += 1;
        continue;
      }
    } else if (
      (mode === "display" &&
        text.startsWith("$$", index) &&
        !escaped(index)) ||
      (mode === "inline" && text[index] === "$" && !escaped(index))
    ) {
      output += mode === "display" ? "$$" : "$";
      index += mode === "display" ? 2 : 1;
      mode = null;
      continue;
    } else if (text[index] === "\\" && text[index + 1] === "\\") {
      output += "\\";
      index += 2;
      continue;
    }

    output += text[index];
    index += 1;
  }
  return output;
}
