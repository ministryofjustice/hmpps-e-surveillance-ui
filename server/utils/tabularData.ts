import { Notification, Person } from '../data/eSurveillanceClient'

export type TableData = {
  caption: string
  title: string
  headers: { text: string }[]
  rows: { text?: string | number | boolean; html?: string }[][]
  notFoundMessage: string
  header: string
}

export function personsToTable(persons: Person[]): TableData {
  const title = 'Persons'
  const headers = [
    { text: 'Id' },
    { text: 'Delius Id' },
    { text: 'Unique Device Wearer Id' },
    { text: 'Person Id' },
    { text: 'Given Name' },
    { text: 'Family Name' },
    { text: 'Alias' },
    { text: 'Created At' },
    { text: 'Toy' },
  ]

  const rows = persons.map(p => [
    { text: p.id },
    { text: p.deliusId },
    { text: p.uniqueDeviceWearerId },
    { text: p.personId },
    { text: p.givenName },
    { text: p.familyName },
    { text: p.alias },
    { text: new Date(p.createdAt).toLocaleString() },
    { text: p.toy },
  ])

  return { caption: title, title, headers, rows, notFoundMessage: 'No person records found.', header: 'Person records' }
}

export function notificationsToTable(notifications: Notification[]): TableData {
  const title = 'Notifications'
  const headers = [{ text: 'Id' }, { text: 'Violation type' }, { text: 'Message' }, { text: 'Date' }]

  const rows = notifications.map(n => [
    { text: n.id },
    { text: n.violation },
    { html: n.message ? n.message.replaceAll('\n\n', '<br/>') : '' },
    { text: new Date(n.timestamp).toLocaleString() },
  ])

  return {
    caption: title,
    title,
    headers,
    rows,
    notFoundMessage: 'No notification generated yet.',
    header: 'Generated notifications',
  }
}
