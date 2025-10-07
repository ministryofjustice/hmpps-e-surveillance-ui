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
  }
}
