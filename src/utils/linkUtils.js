/**
 * Enhanced internal link helper with HTML safety
 * Automatically converts keywords in text to internal links
 * @param {string} text - HTML text content
 * @param {Array} links - Array of {keyword, url, title} objects
 * @returns {string} - HTML with internal links added
 */
export const addInternalLinks = (text, links = []) => {
  if (!links.length || !text) return text;

  // Create a temporary div to safely parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = text;

  // Only process text nodes to avoid nested links
  const walkTextNodes = (node) => {
    if (node.nodeType === 3) {
      // Text node
      let textContent = node.textContent;
      let hasChanges = false;

      links.forEach(({ keyword, url, title }) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        if (regex.test(textContent)) {
          textContent = textContent.replace(
            regex,
            `<LINK_PLACEHOLDER_${keyword.replace(/\s+/g, "_")}_${url}_${title}>`
          );
          hasChanges = true;
        }
      });

      if (hasChanges) {
        const wrapper = document.createElement("span");
        wrapper.innerHTML = textContent.replace(
          /<LINK_PLACEHOLDER_([^_]+(?:_[^_]+)*)_([^_]+)_([^>]+)>/g,
          (match, keyword, url, title) => {
            const cleanKeyword = keyword.replace(/_/g, " ");
            return `<a href="${url}" title="${title}" class="text-blue-600 hover:text-blue-800 underline">${cleanKeyword}</a>`;
          }
        );

        while (wrapper.firstChild) {
          node.parentNode.insertBefore(wrapper.firstChild, node);
        }
        node.parentNode.removeChild(node);
      }
    } else if (node.nodeType === 1 && node.tagName !== "A") {
      // Element node, not a link
      Array.from(node.childNodes).forEach(walkTextNodes);
    }
  };

  walkTextNodes(tempDiv);

  return tempDiv.innerHTML;
};