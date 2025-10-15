export const validPractitionerData = {
  ppGivenName: 'Chris',
  ppFamilyName: 'Johnson',
  email: 'chris.johnson@justice.gov.uk',
}

export const invalidPractitionerData = {
  missingGivenName: {
    ppGivenName: '',
    ppFamilyName: 'Johnson',
    email: 'chris.johnson@justice.gov.uk',
  },
  missingFamilyName: {
    ppGivenName: 'Chris',
    ppFamilyName: '',
    email: 'chris.johnson@justice.gov.uk',
  },
  missingEmail: {
    ppGivenName: 'Chris',
    ppFamilyName: 'Johnson',
    email: '',
  },
  invalidEmail: {
    ppGivenName: 'Chris',
    ppFamilyName: 'Johnson',
    email: 'invalid-email',
  },
  allFieldsMissing: {
    ppGivenName: '',
    ppFamilyName: '',
    email: '',
  },
}

export const validPersonData = {
  givenName: 'John',
  familyName: 'Smith',
  phoneNumber: '07123456789',
}

export const invalidPersonData = {
  missingGivenName: {
    givenName: '',
    familyName: 'Smith',
    phoneNumber: '07123456789',
  },
  missingFamilyName: {
    givenName: 'John',
    familyName: '',
    phoneNumber: '07123456789',
  },
  missingPhoneNumber: {
    givenName: 'John',
    familyName: 'Smith',
    phoneNumber: '',
  },
  invalidPhoneNumber: {
    givenName: 'John',
    familyName: 'Smith',
    phoneNumber: 'invalid-phone',
  },
  allFieldsMissing: {
    givenName: '',
    familyName: '',
    phoneNumber: '',
  },
}

export const validNotificationRequest = {
  personId: 'PER001',
  type: 'CURFEW_VIOLATION',
  templateId: 'template-123',
  phoneNumber: '07123456789',
  practitioner: validPractitionerData,
  person: validPersonData,
}

export const specialCharacterData = {
  practitioner: {
    ppGivenName: "Mary-Jane O'Connor",
    ppFamilyName: 'Smith-Wilson',
    email: 'mary.jane@justice.gov.uk',
  },
  person: {
    givenName: "John-Paul O'Connor",
    familyName: 'Smith-Jones',
    phoneNumber: '07123456789',
  },
}

export const unicodeData = {
  practitioner: {
    ppGivenName: 'José',
    ppFamilyName: 'García-López',
    email: 'jose.garcia@justice.gov.uk',
  },
  person: {
    givenName: 'José',
    familyName: 'García-López',
    phoneNumber: '07123456789',
  },
}

export const governmentEmails = [
  'chris@justice.gov.uk',
  'probation@hmcts.gov.uk',
  'admin@homeoffice.gov.uk',
  'user@noms.gov.uk',
]

export const phoneNumberTestCases = [
  { phone: '07123456789', valid: true, description: 'valid UK mobile' },
  { phone: '+447123456789', valid: true, description: 'valid UK mobile with country code' },
  { phone: '447123456789', valid: true, description: 'valid UK mobile without +' },
  { phone: '01234567890', valid: false, description: 'invalid - not mobile format' },
  { phone: '12345', valid: false, description: 'invalid - too short' },
  { phone: '071234567890123', valid: false, description: 'invalid - too long' },
  { phone: 'not-a-number', valid: false, description: 'invalid - not numeric' },
  { phone: '08123456789', valid: false, description: 'invalid - wrong prefix' },
]

export const emailTestCases = [
  { email: 'chris.johnson@justice.gov.uk', valid: true, description: 'valid gov.uk email' },
  { email: 'test@example.com', valid: true, description: 'valid standard email' },
  { email: 'user@domain.co.uk', valid: true, description: 'valid .co.uk email' },
  { email: 'invalid-email', valid: false, description: 'missing @ and domain' },
  { email: '@domain.com', valid: false, description: 'missing username' },
  { email: 'user@', valid: false, description: 'missing domain' },
  { email: 'user.domain.com', valid: false, description: 'missing @' },
  { email: 'user@domain', valid: false, description: 'missing TLD' },
  { email: 'user name@domain.com', valid: false, description: 'space in username' },
]
