export const validPractitionerData = {
  ppGivenName: 'Test',
  ppFamilyName: 'User',
  email: 'test.user@example.com',
}

export const invalidPractitionerData = {
  missingGivenName: {
    ppGivenName: '',
    ppFamilyName: 'User',
    email: 'test.user@example.com',
  },
  missingFamilyName: {
    ppGivenName: 'Test',
    ppFamilyName: '',
    email: 'test.user@example.com',
  },
  missingEmail: {
    ppGivenName: 'Test',
    ppFamilyName: 'User',
    email: '',
  },
  invalidEmail: {
    ppGivenName: 'Test',
    ppFamilyName: 'User',
    email: 'invalid-email',
  },
  allFieldsMissing: {
    ppGivenName: '',
    ppFamilyName: '',
    email: '',
  },
}

export const validPersonData = {
  givenName: 'Sample',
  familyName: 'Person',
  phoneNumber: '07000000000',
}

export const invalidPersonData = {
  missingGivenName: {
    givenName: '',
    familyName: 'Person',
    phoneNumber: '07000000000',
  },
  missingFamilyName: {
    givenName: 'Sample',
    familyName: '',
    phoneNumber: '07000000000',
  },
  missingPhoneNumber: {
    givenName: 'Sample',
    familyName: 'Person',
    phoneNumber: '',
  },
  invalidPhoneNumber: {
    givenName: 'Sample',
    familyName: 'Person',
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
  phoneNumber: '07000000000',
  practitioner: validPractitionerData,
  person: validPersonData,
}

export const specialCharacterData = {
  practitioner: {
    ppGivenName: "Mary-Jane O'Connor",
    ppFamilyName: 'Smith-Wilson',
    email: 'mary.jane@example.com',
  },
  person: {
    givenName: "John-Paul O'Connor",
    familyName: 'Smith-Jones',
    phoneNumber: '07000000001',
  },
}

export const unicodeData = {
  practitioner: {
    ppGivenName: 'José',
    ppFamilyName: 'García-López',
    email: 'jose.garcia@example.com',
  },
  person: {
    givenName: 'José',
    familyName: 'García-López',
    phoneNumber: '07000000002',
  },
}

export const governmentEmails = [
  'chris.johnson@example.com',
  'probation.team@example.com',
  'admin.office@example.com',
  'user.account@example.com',
]

export const phoneNumberTestCases = [
  { phone: '07000000000', valid: true, description: 'valid UK mobile' },
  { phone: '+447000000000', valid: true, description: 'valid UK mobile with country code' },
  { phone: '447000000000', valid: true, description: 'valid UK mobile without +' },
  { phone: '01000000000', valid: false, description: 'invalid - not mobile format' },
  { phone: '12345', valid: false, description: 'invalid - too short' },
  { phone: '070000000000000', valid: false, description: 'invalid - too long' },
  { phone: 'not-a-number', valid: false, description: 'invalid - not numeric' },
  { phone: '08000000000', valid: false, description: 'invalid - wrong prefix' },
]

export const emailTestCases = [
  { email: 'name.surname@example.com', valid: true, description: 'valid example email' },
  { email: 'test@example.com', valid: true, description: 'valid standard email' },
  { email: 'user@domain.co.uk', valid: true, description: 'valid .co.uk email' },
  { email: 'invalid-email', valid: false, description: 'missing @ and domain' },
  { email: '@domain.com', valid: false, description: 'missing username' },
  { email: 'user@', valid: false, description: 'missing domain' },
  { email: 'user.domain.com', valid: false, description: 'missing @' },
  { email: 'user@domain', valid: false, description: 'missing TLD' },
  { email: 'user name@domain.com', valid: false, description: 'space in username' },
]
