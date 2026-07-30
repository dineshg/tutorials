import {parts} from "./book-structure.mjs";

function docId(folder, file) {
  if (file === "index.html") return `${folder}/index`;
  const generatedId = file.replace(/\.html$/, "").replace(/^\d+-/, "");
  return `${folder}/${generatedId}`;
}

function partItems(part) {
  const items = [];
  for (const [file] of part.documents.slice(1)) {
    items.push(docId(part.folder, file));
    for (const extra of part.extraItems || []) {
      if (extra.after === file) {
        items.push({
          type: "link",
          label: extra.label,
          href: extra.href,
          className: "sidebar-lab-link",
        });
      }
    }
  }
  return items;
}

const bookSidebar = [
  "home",
  "content-map",
  ...parts.map((part) => ({
    type: "category",
    label: part.label,
    collapsible: true,
    collapsed: true,
    className: `sidebar-category sidebar-category-${part.accent}`,
    link: {
      type: "doc",
      id: `${part.folder}/index`,
    },
    items: partItems(part),
  })),
];

export default {
  bookSidebar,
};
