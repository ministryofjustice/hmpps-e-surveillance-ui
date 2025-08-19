import ESurveillanceApiClient, { PersonsResponse, NotificationsResponse, QueryParam } from '../data/eSurveillanceClient'

export default class ESurveillanceService {
  constructor(private readonly apiClient: ESurveillanceApiClient) {}

  async getPersons(queryParams?: Record<string, QueryParam>): Promise<PersonsResponse['content']> {
    const response = await this.apiClient.getPersons(queryParams)
    return response?.content ?? []
  }

  async getNotifications(queryParams?: Record<string, QueryParam>): Promise<NotificationsResponse['content']> {
    const response = await this.apiClient.getNotifications(queryParams)
    return response?.content ?? []
  }
}
