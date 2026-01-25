import { translateBatch } from "./googleTranslate"; 

export async function translatePage(targetLang) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  const originalTexts = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue.trim();
    if (text.length > 2) {
      textNodes.push(node);
      originalTexts.push(text);
    }
  }

  if (!originalTexts.length) return;

  const translated = await translateBatch(originalTexts, targetLang);

  translated.forEach((text, i) => {
    textNodes[i].nodeValue = text;
  });
}
