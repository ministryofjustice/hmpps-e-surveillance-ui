import superagent from 'superagent'

const API_URL = process.env.API_URL || 'http://localhost:8080'

export type Notification = {
  id: number
  personId: string
  violation: string
  timestamp: string
  message: string
}
export type Person = {
  id: number
  deliusId: string
  uniqueDeviceWearerId: string
  personId: string
  givenName: string
  familyName: string
  alias: string
  createdAt: string
  toy: boolean
}

export type ApiResponse<T> = {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    offset: number
    paged: boolean
    unpaged: boolean
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
  }
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}

export type NotificationsResponse = ApiResponse<Notification>
export type PersonsResponse = ApiResponse<Person>
export type QueryParam = string | number | Date
function buildUrl(endpoint: string, queryParams?: Record<string, QueryParam>) {
  const url = new URL(`${API_URL}/${endpoint}`)
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  return url.toString()
}

export const httpService = {
  async persons(queryParams?: Record<string, QueryParam>): Promise<PersonsResponse> {
    try {
      const url = buildUrl('persons', queryParams)
      const response = await superagent.get(url).set('Content-Type', 'application/json')
      return response.body
    } catch (err) {
      console.error(err)
      return null
    }
  },

  async notifications(queryParams?: Record<string, QueryParam>): Promise<NotificationsResponse> {
    try {
      const url = buildUrl('notifications', queryParams)
      const response = await superagent.get(url).set('Content-Type', 'application/json')
      return response.body
    } catch (err) {
      console.error(err)
      return null
    }
  },
}
