export interface FieldError {
  message: string
  href: string
}

export const personFieldErrors: Record<'givenName' | 'familyName' | 'phoneNumber', FieldError> = {
  givenName: { message: 'Enter first name', href: '#first-name' },
  familyName: { message: 'Enter last name', href: '#family-name' },
  phoneNumber: { message: 'Enter mobile number', href: '#phoneNumber' },
}

export const practitionerFieldErrors: Record<'ppGivenName' | 'ppFamilyName' | 'email', FieldError> = {
  ppGivenName: { message: 'Enter first name', href: '#first-name' },
  ppFamilyName: { message: 'Enter last name', href: '#family-name' },
  email: { message: 'Enter email address', href: '#email' },
}

export const violationTypeFieldErrors: Record<'violationType', FieldError> = {
  violationType: { message: 'Select an option', href: '#violationType' },
}
