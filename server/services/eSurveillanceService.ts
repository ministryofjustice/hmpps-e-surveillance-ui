import ESurveillanceApiClient, {
  ApiResponse,
  PersonsResponse,
  NotificationsResponse,
  QueryParam,
  Notification,
  Person,
} from '../data/eSurveillanceClient'

export default class ESurveillanceService {
  constructor(private readonly apiClient: ESurveillanceApiClient) {}

  async getPersons(queryParams?: Record<string, QueryParam>): Promise<ApiResponse<Person>> {
    const response = await this.apiClient.getPersons(queryParams)
    return response
  }

  async getNotifications(queryParams?: Record<string, QueryParam>): Promise<ApiResponse<Notification>> {
    const response = await this.apiClient.getNotifications(queryParams)
    return response
  }

  async getUploadUrl(filename: string): Promise<string> {
    const response = await this.apiClient.getUploadUrl(filename)
    return response.toString()
  }
}
