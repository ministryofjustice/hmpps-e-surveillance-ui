import 'express-session'

declare module 'express-session' {
  export interface SessionData {
    practitionerData?: {
      ppGivenName: string
      ppFamilyName: string
      email: string
    }
    personData?: {
      givenName: string
      familyName: string
      phoneNumber: string
    }
    GovukError?: {
      text: string
      href: string
    }
    ErrorsByField?: {
      [fieldName: string]: {
        text: string
      }
    }
    personDataErrors?: {
      errors: GovukError[]
      errorsByField: ErrorsByField
      data: personData
    }
    practitionerDataErrors?: {
      errors: GovukError[]
      errorsByField: ErrorsByField
      data: practitionerData
    }
  }
}
