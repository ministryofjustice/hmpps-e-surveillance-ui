const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

function splitPreview(message: string): { preview: string; rest: string } {
  const maxLength: number = 100
  if (message.length <= maxLength) {
    return { preview: message, rest: '' }
  }
  const initial = message.slice(0, maxLength)
  const lastSpace = initial.lastIndexOf(' ')
  const cutoff = lastSpace > 0 ? lastSpace : maxLength

  const preview = message.slice(0, cutoff)
  const rest = message.slice(cutoff)

  return { preview, rest }
}

export function generateReadMoreHtml(message: string, id: string | number): string {
  const refindMessage = message ? message.replaceAll('\n\n', '<br/>') : ''
  const { preview, rest } = splitPreview(refindMessage)

  return `
    <div class="read-more-cell">
      <input type="checkbox" id="toggle‑${id}" class="read-more-checkbox">
      <span class="read-more-text">
        ${preview}<span class="ellipsis">...</span>
        <span class="more-text">${rest}</span>
      </span>
      <br/>
      <label for="toggle‑${id}" class="read-more-label"></label>
    </div>
 `
}

export function formatTimestamp(input: string): string {
  const date = new Date(input)

  const time = date
    .toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase()

  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString('en-GB', { month: 'short' })
  const year = date.getFullYear()

  return `${time} ${day} ${month} ${year}`
}
