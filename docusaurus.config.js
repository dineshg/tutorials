import {themes as prismThemes} from "prism-react-renderer";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import {siteBaseUrl} from "./book-structure.mjs";

const config = {
  title: "Enterprise AI, Agents & Applied ML",
  tagline:
    "A practical technical book from delivery foundations to modern LLM systems",
  favicon: "img/favicon.svg",
  url: "https://dineshg.github.io",
  baseUrl: siteBaseUrl,
  organizationName: "dineshg",
  projectName: "tutorials",
  deploymentBranch: "gh-pages",
  trailingSlash: false,
  onBrokenLinks: "throw",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },

  staticDirectories: ["static", "assets"],

  headTags: [
    {
      tagName: "script",
      attributes: {type: "text/javascript"},
      innerHTML: `
        window.MathJax = {
          startup: { typeset: false },
          tex: {
            inlineMath: [['\\\\(', '\\\\)'], ['$', '$']],
            displayMath: [['\\\\[', '\\\\]'], ['$$', '$$']],
            processEscapes: true
          },
          options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
          }
        };
      `,
    },
  ],

  scripts: [
    {
      src: "https://cdn.jsdelivr.net/npm/mathjax@4.1.3/tex-mml-chtml.js",
      defer: true,
    },
  ],

  stylesheets: [
    {
      href: `${siteBaseUrl}css/book.css`,
      type: "text/css",
    },
    {
      href: `${siteBaseUrl}vendor/highlight.js/11.9.0/styles/github-dark.min.css`,
      type: "text/css",
    },
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.18.1/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP",
      crossorigin: "anonymous",
    },
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],

  themeConfig: {
    metadata: [
      {
        name: "keywords",
        content:
          "enterprise AI, machine learning, deep learning, LLM, FastAPI, Pydantic, MCP, authentication",
      },
    ],
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Enterprise AI Book",
      hideOnScroll: false,
      items: [
        {to: "/", label: "Read", position: "left", activeBaseRegex: "^/$"},
        {to: "/content-map", label: "Concept map", position: "left"},
        {
          to: "/part5-deep-learning-and-llms/10-recurrent-neural-networks",
          label: "Deep learning",
          position: "left",
        },
        {
          type: "html",
          position: "right",
          className: "book-search-navbar-item",
          value:
            '<button type="button" class="book-search-trigger" aria-label="Search the book">Search <kbd>Ctrl K</kbd></button>',
        },
        {
          href: "https://github.com/dineshg/tutorials",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Study",
          items: [
            {label: "Book home", to: "/"},
            {label: "Reading guide", to: "/content-map"},
            {label: "Interactive RNN lab", to: "/labs/rnn"},
          ],
        },
        {
          title: "Core tracks",
          items: [
            {
              label: "Backend and security",
              to: "/part2-backend-platform-security/overview",
            },
            {
              label: "Agent protocols",
              to: "/part3-agent-protocols/overview",
            },
            {
              label: "Deep learning and LLMs",
              to: "/part5-deep-learning-and-llms/overview",
            },
          ],
        },
      ],
      copyright: `Enterprise AI, Agents & Applied ML - ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "bash",
        "docker",
        "http",
        "json",
        "python",
        "sql",
        "typescript",
        "yaml",
      ],
    },
  },
};

export default config;
