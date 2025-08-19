import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'

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

export default class ESurveillanceApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('E-Surveillance API', config.apis.eSurveillanceApi, logger, authenticationClient)
  }

  private buildQueryParams(queryParams?: Record<string, QueryParam>): URLSearchParams {
    const params = new URLSearchParams()
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    return params
  }

  async getPersons(queryParams?: Record<string, QueryParam>): Promise<PersonsResponse> {
    return this.get<PersonsResponse>({ path: '/persons', query: this.buildQueryParams(queryParams) }, asSystem())
  }

  async getNotifications(queryParams?: Record<string, QueryParam>): Promise<NotificationsResponse> {
    return this.get<NotificationsResponse>(
      { path: '/notifications', query: this.buildQueryParams(queryParams) },
      asSystem(),
    )
  }
}
