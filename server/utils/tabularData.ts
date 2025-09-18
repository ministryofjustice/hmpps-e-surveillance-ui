import { Notification, Person } from '../data/eSurveillanceClient'
import { getPaginationData, PaginationData } from './paginationData'
import { generateReadMoreHtml } from './utils'

export type TableData = {
  title: string
  headers: { text: string }[]
  rows: { text?: string | number | boolean; html?: string }[][]
  pagination: PaginationData
  notFoundMessage: string
  header: string
  searchUrl: string
}

export function personsToTable(
  persons: Person[],
  currentPageNumber: number,
  totalElements: number,
  pageSize: number,
  searchText: string,
): TableData {
  const title = 'Persons'
  const headers = [
    { text: 'Name', attributes: { 'aria-sort': 'descending' } },
    { text: 'CRN', attributes: { 'aria-sort': 'descending' } },
    { text: 'Device wearer ID', attributes: { 'aria-sort': 'descending' } },
    { text: 'Person ID', attributes: { 'aria-sort': 'descending' } },
    { text: 'Alias', attributes: { 'aria-sort': 'descending' } },
    { text: 'Last data feed received', attributes: { 'aria-sort': 'descending' } },
    { text: 'Toy', attributes: { 'aria-sort': 'descending' } },
  ]

  const rows = persons.map(p => [
    { text: `${p.givenName} ${p.familyName}` },
    { text: 'P485739' },
    { text: p.uniqueDeviceWearerId },
    { text: p.personId },
    { text: p.alias },
    { text: new Date(p.createdAt).toLocaleString() },
    { text: String(p.toy).replace(/^./, c => c.toUpperCase()) },
  ])

  const paginationUrl =
    searchText === undefined ? '/cases?page=' : `/cases?search=${encodeURIComponent(searchText)}&page=`

  const pagination = getPaginationData(totalElements, currentPageNumber, pageSize, paginationUrl)
  return {
    title,
    headers,
    rows,
    pagination,
    notFoundMessage: 'No cases records.',
    header: 'Cases',
    searchUrl: '/cases',
  }
}

export function notificationsToTable(
  notifications: Notification[],
  currentPageNumber: number,
  totalElements: number,
  pageSize: number,
  searchText: string,
): TableData {
  const title = 'Notifications'
  const headers = [
    { text: 'Violation type', attributes: { 'aria-sort': 'descending' } },
    { text: 'Name', attributes: { 'aria-sort': 'descending' } },
    { text: 'Sent to', attributes: { 'aria-sort': 'descending' } },
    { text: 'Sent on', attributes: { 'aria-sort': 'descending' } },
    { text: 'Practitioner', attributes: { 'aria-sort': 'descending' } },
    { text: 'Status', attributes: { 'aria-sort': 'descending' } },
    { text: 'Message sent', attributes: { 'aria-sort': 'descending' } },
  ]

  const rows = notifications.map((n, index) => [
    { text: formatViolations(n.violation) },
    { text: n.personName },
    { text: '07400000000' },
    { text: '9:15 AM 15 Aug 2025' },
    { text: 'Mark Smith' },
    { text: 'Sent' },
    { html: generateReadMoreHtml(n.message, index) },
  ])

  const paginationUrl =
    searchText === undefined ? '/notifications?page=' : `/notifications?search=${encodeURIComponent(searchText)}&page=`

  const pagination = getPaginationData(totalElements, currentPageNumber, pageSize, paginationUrl)
  return {
    title,
    headers,
    rows,
    pagination,
    notFoundMessage: 'No notification generated yet.',
    header: 'Notifications',
    searchUrl: '/notifications',
  }

  function formatViolations(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
      .join(' ') // "Tampering with device"
  }
}
