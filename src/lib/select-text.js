export default function selectText(element) {
  let range
  let selection
  const doc = document
  if (window.getSelection) {
    selection = window.getSelection()
    range = doc.createRange()
    range.selectNodeContents(element)
    selection.removeAllRanges()
    selection.addRange(range)
  } else if (doc.body.createTextRange) {
    range = doc.body.createTextRange()
    range.moveToElementText(element)
    range.select()
  }
}

export function copyToClipboard() {
  try {
    // copy text
    document.execCommand('copy');
  } catch (err) {
    alert('please press Ctrl/Cmd+C to copy');
    return false
  }
  return true
}
