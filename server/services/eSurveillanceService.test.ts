import ESurveillanceService from './eSurveillanceService'
import ESurveillanceApiClient from '../data/eSurveillanceClient'
import { mockPersonsApiResponse, mockNotificationsApiResponse } from '../testData'

jest.mock('../data/eSurveillanceClient')

describe('ESurveillanceService', () => {
  let service: ESurveillanceService
  let mockApiClient: jest.Mocked<ESurveillanceApiClient>

  beforeEach(() => {
    mockApiClient = {
      getPersons: jest.fn(),
      getNotifications: jest.fn(),
      getUploadUrl: jest.fn(),
      triggerNotification: jest.fn(),
    } as unknown as jest.Mocked<ESurveillanceApiClient>
    service = new ESurveillanceService(mockApiClient)
  })

  describe('getPersons', () => {
    it('should fetch persons from API', async () => {
      mockApiClient.getPersons.mockResolvedValue(mockPersonsApiResponse)

      const result = await service.getPersons({})

      expect(mockApiClient.getPersons).toHaveBeenCalled()
      expect(result).toEqual(mockPersonsApiResponse)
    })

    it('should handle API errors', async () => {
      mockApiClient.getPersons.mockRejectedValue(new Error('API Error'))

      await expect(service.getPersons({})).rejects.toThrow('API Error')
    })
  })

  describe('getNotifications', () => {
    it('should fetch notifications from API', async () => {
      mockApiClient.getNotifications.mockResolvedValue(mockNotificationsApiResponse)

      const result = await service.getNotifications({})

      expect(mockApiClient.getNotifications).toHaveBeenCalled()
      expect(result).toEqual(mockNotificationsApiResponse)
    })

    it('should handle API errors', async () => {
      mockApiClient.getNotifications.mockRejectedValue(new Error('API Error'))

      await expect(service.getNotifications({})).rejects.toThrow('API Error')
    })
  })

  describe('getUploadUrl', () => {
    it('should get signed upload URL', async () => {
      const mockUrl = new URL('https://s3-signed-url.amazonaws.com')
      mockApiClient.getUploadUrl.mockResolvedValue(mockUrl)

      const result = await service.getUploadUrl('test.csv')

      expect(mockApiClient.getUploadUrl).toHaveBeenCalledWith('test.csv')
      expect(result).toBe('https://s3-signed-url.amazonaws.com/')
    })
  })

  describe('triggerNotification', () => {
    it('should trigger notification', async () => {
      mockApiClient.triggerNotification.mockResolvedValue()

      const request = {
        ppGivenName: 'Chris',
        ppFamilyName: 'Johnson',
        givenName: 'John',
        familyName: 'Smith',
        violationType: 'CURFEW_VIOLATION',
        phoneNumber: '07123456789',
        email: 'chris.johnson@justice.gov.uk',
      }

      await service.triggerNotification(request)

      expect(mockApiClient.triggerNotification).toHaveBeenCalledWith(request)
    })
  })
})
