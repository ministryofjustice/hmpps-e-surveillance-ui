export default function normaliseQuery(query: object): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      result[key] = value[0]?.toString() ?? ''
    } else if (value != null) {
      result[key] = value.toString()
    }
  }
  return result
}
