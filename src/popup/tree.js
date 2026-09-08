/**
 * Bookmark tree: builds the searchable index, renders the folder/bookmark tree
 * and search results, opens bookmarks, and handles list keyboard navigation.
 */

import { isSafeUrl, stripMarker } from "../shared/url.js";
import { MAX_SEARCH_RESULTS } from "../shared/constants.js";
import {
  els,
  faviconUrl,
  makeEmpty,
  isVisible,
  setStatus,
  showError,
  debounce,
} from "./dom.js";
import { isOpenInBackground } from "./settings/background.js";

/** @type {{ id: string, title: string, url: string }[]} */
let searchIndex = [];
/** Cached bookmark tree, reused when the search box is cleared. */
let cachedRoots = [];
let folderSeq = 0;

/** Read-only access to the flat bookmark index (used by the per-bookmark grid). */
export function getSearchIndex() {
  return searchIndex;
}

/** Load the bookmark tree, render it, and wire search + keyboard navigation. */
export async function initTree() {
  els.search.addEventListener("input", debounce(onSearch, 90));
  els.search.addEventListener("keydown", onSearchKeydown);
  els.tree.addEventListener("keydown", onTreeKeydown);

  try {
    cachedRoots = await chrome.bookmarks.getTree();
    buildSearchIndex(cachedRoots);
    renderTree(cachedRoots);
    els.search.focus();
  } catch (err) {
    showError(err);
  }
}

/** Clear the search box and show the full tree again. */
export function clearSearch() {
  els.search.value = "";
  onSearch();
}

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */

function renderTree(roots) {
  els.tree.replaceChildren();

  // getTree() returns a single hidden root; render its top-level folders.
  const topLevel = roots[0]?.children ?? [];
  const list = buildNodeList(topLevel, 0);

  if (!list.childElementCount) {
    els.tree.append(makeEmpty("No bookmarks yet."));
  } else {
    els.tree.append(list);
  }
  setStatus(`${searchIndex.length} bookmarks`);
}

/**
 * @param {chrome.bookmarks.BookmarkTreeNode[]} nodes
 * @param {number} depth
 * @returns {HTMLUListElement}
 */
function buildNodeList(nodes, depth) {
  const ul = document.createElement("ul");
  ul.className = "node-list";

  for (const node of nodes) {
    if (node.url === undefined) {
      ul.append(buildFolder(node, depth));
    } else {
      ul.append(buildBookmark(node));
    }
  }
  return ul;
}

/** @param {chrome.bookmarks.BookmarkTreeNode} node */
function buildFolder(node, depth) {
  const li = document.createElement("li");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "row folder";
  // Top-level folders (e.g. the Bookmarks Bar) start expanded.
  const expanded = depth === 0;
  btn.setAttribute("aria-expanded", String(expanded));

  const twisty = document.createElement("span");
  twisty.className = "twisty";
  twisty.setAttribute("aria-hidden", "true");
  twisty.textContent = "▾";

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = node.title || "Untitled folder";

  const count = document.createElement("span");
  count.className = "sub";
  count.textContent = String((node.children ?? []).length);

  btn.append(twisty, label, count);
  li.append(btn);

  const childList = buildNodeList(node.children ?? [], depth + 1);
  childList.id = `folder-${folderSeq++}`;
  childList.hidden = !expanded;
  btn.setAttribute("aria-controls", childList.id);
  li.append(childList);

  btn.addEventListener("click", () => {
    const nowExpanded = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(nowExpanded));
    childList.hidden = !nowExpanded;
  });

  return li;
}

/** @param {chrome.bookmarks.BookmarkTreeNode} node */
function buildBookmark(node) {
  const li = document.createElement("li");
  li.append(makeBookmarkRow(node));
  return li;
}

/** @param {{ title: string, url: string }} node */
function makeBookmarkRow(node) {
  // Bookmarks may carry BookmarkUp's `newtab@` marker; show and open them clean.
  const url = stripMarker(node.url);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "row bookmark";
  btn.title = url;

  const icon = document.createElement("img");
  icon.className = "icon";
  icon.width = 16;
  icon.height = 16;
  icon.alt = "";
  icon.src = faviconUrl(url);
  icon.addEventListener("error", () => {
    icon.style.visibility = "hidden";
  });

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = node.title || url;

  btn.append(icon, label);
  btn.addEventListener("click", () => openBookmark(url));
  return btn;
}

/* ------------------------------------------------------------------ *
 * Search
 * ------------------------------------------------------------------ */

function buildSearchIndex(roots) {
  searchIndex = [];
  const walk = (node) => {
    if (node.url !== undefined) {
      searchIndex.push({
        id: node.id,
        title: node.title || "",
        url: stripMarker(node.url),
      });
    }
    for (const child of node.children ?? []) walk(child);
  };
  for (const root of roots) walk(root);
}

function onSearch() {
  const query = els.search.value.trim().toLowerCase();
  if (!query) {
    renderTree(cachedRoots);
    return;
  }

  const matches = [];
  for (const entry of searchIndex) {
    if (
      entry.title.toLowerCase().includes(query) ||
      entry.url.toLowerCase().includes(query)
    ) {
      matches.push(entry);
      if (matches.length >= MAX_SEARCH_RESULTS) break;
    }
  }

  els.tree.replaceChildren();
  if (!matches.length) {
    els.tree.append(makeEmpty("No matches."));
    setStatus("0 results");
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "node-list";
  for (const entry of matches) {
    const li = document.createElement("li");
    li.append(makeBookmarkRow(entry));
    ul.append(li);
  }
  els.tree.append(ul);
  setStatus(
    matches.length >= MAX_SEARCH_RESULTS
      ? `${MAX_SEARCH_RESULTS}+ results`
      : `${matches.length} result${matches.length === 1 ? "" : "s"}`,
  );
}

/* ------------------------------------------------------------------ *
 * Opening
 * ------------------------------------------------------------------ */

function openBookmark(rawUrl) {
  if (!isSafeUrl(rawUrl)) {
    setStatus("Blocked an unsupported link.");
    return;
  }
  chrome.tabs
    .create({ url: rawUrl, active: !isOpenInBackground() })
    .then(() => {
      // An active tab steals focus and Chrome closes the popup for us.
      // In background mode the popup stays open so several can be opened.
      if (isOpenInBackground()) els.search.focus();
    })
    .catch(showError);
}

/* ------------------------------------------------------------------ *
 * Keyboard
 * ------------------------------------------------------------------ */

function onSearchKeydown(event) {
  // Enter opens the first result; ArrowDown jumps into the list.
  if (event.key === "Enter") {
    const first = els.tree.querySelector(".row.bookmark");
    if (first) first.click();
  } else if (event.key === "ArrowDown") {
    const first = els.tree.querySelector(".row");
    if (first) {
      event.preventDefault();
      first.focus();
    }
  }
}

function onTreeKeydown(event) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  const rows = [...els.tree.querySelectorAll(".row")].filter(isVisible);
  if (!rows.length) return;

  event.preventDefault();
  const index = rows.indexOf(document.activeElement);
  let next;
  if (index === -1) {
    // Focus isn't on a row yet: ArrowDown → first, ArrowUp → last.
    next = event.key === "ArrowDown" ? rows[0] : rows[rows.length - 1];
  } else if (event.key === "ArrowDown") {
    next = rows[Math.min(index + 1, rows.length - 1)];
  } else {
    next = rows[Math.max(index - 1, 0)];
  }
  next.focus();
}
