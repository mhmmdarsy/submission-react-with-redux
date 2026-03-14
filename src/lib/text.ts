export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function truncateText(text: string, maxLength = 140) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}
