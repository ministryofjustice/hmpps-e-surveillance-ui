import { FieldError } from './fieldConfigs'

export interface GovukError {
  text: string
  href: string
}

export interface ErrorsByField {
  [field: string]: {
    text: string
  }
}

export function validateRequiredFields<T extends Record<string, string>>(
  formData: T,
  errorMap: Record<keyof T, FieldError>,
): {
  errors: GovukError[]
  errorsByField: ErrorsByField
  hasErrors: boolean
} {
  const errors: GovukError[] = []
  const errorsByField: ErrorsByField = {}

  Object.entries(formData).forEach(([field, value]) => {
    const key = field as keyof T
    const error = errorMap[key]
    if (!value || value.trim() === '') {
      errors.push({ text: error.message, href: error.href })
      errorsByField[field] = { text: error.message }
    }
  })

  return { errors, errorsByField, hasErrors: errors.length > 0 }
}
