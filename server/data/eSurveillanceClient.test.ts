import ESurveillanceApiClient from './eSurveillanceClient'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asSystem } from '@ministryofjustice/hmpps-rest-client'
import { mockPersonsApiResponse, mockNotificationsApiResponse } from '../testData'

jest.mock('@ministryofjustice/hmpps-rest-client')
jest.mock('../config', () => ({
  apis: {
    eSurveillanceApi: {
      url: 'http://localhost:8080',
      timeout: 10000,
    },
  },
}))

describe('ESurveillanceApiClient', () => {
  let client: ESurveillanceApiClient
  let mockAuthClient: jest.Mocked<AuthenticationClient>
  let mockGet: jest.Mock
  let mockPost: jest.Mock

  beforeEach(() => {
    mockAuthClient = {} as jest.Mocked<AuthenticationClient>

    mockGet = jest.fn()
    mockPost = jest.fn()

    client = new ESurveillanceApiClient(mockAuthClient)

    jest.spyOn(client, 'get').mockImplementation(mockGet)
    jest.spyOn(client, 'post').mockImplementation(mockPost)
  })

  describe('getPersons', () => {
    it('should fetch persons', async () => {
      mockGet.mockResolvedValue(mockPersonsApiResponse)

      const result = await client.getPersons()

      expect(mockGet).toHaveBeenCalledWith({ path: '/persons', query: '' }, undefined)
      expect(result).toEqual(mockPersonsApiResponse)
    })

    it('should handle search parameter', async () => {
      mockGet.mockResolvedValue(mockPersonsApiResponse)

      await client.getPersons({ search: 'John' })

      expect(mockGet).toHaveBeenCalledWith(
        {
          path: '/persons',
          query: 'search=John',
        },
        undefined,
      )
    })
  })

  describe('getNotifications', () => {
    it('should fetch notifications', async () => {
      mockGet.mockResolvedValue(mockNotificationsApiResponse)

      const result = await client.getNotifications()

      expect(mockGet).toHaveBeenCalledWith({ path: '/notifications', query: '' }, undefined)
      expect(result).toEqual(mockNotificationsApiResponse)
    })

    it('should handle search parameter', async () => {
      mockGet.mockResolvedValue(mockNotificationsApiResponse)

      await client.getNotifications({ search: 'curfew' })

      expect(mockGet).toHaveBeenCalledWith(
        {
          path: '/notifications',
          query: 'search=curfew',
        },
        undefined,
      )
    })
  })

  describe('getUploadUrl', () => {
    it('should get upload URL', async () => {
      const mockResponse = 'https://s3-signed-url.amazonaws.com'
      mockGet.mockResolvedValue(mockResponse)

      const result = await client.getUploadUrl('test.csv')

      expect(mockGet).toHaveBeenCalledWith(
        {
          path: '/get-upload-url',
          query: { filename: 'test.csv' },
        },
        undefined,
      )
      expect(result.toString()).toBe('https://s3-signed-url.amazonaws.com/')
    })
  })

  describe('triggerNotification', () => {
    it('should trigger notification', async () => {
      const request = {
        ppGivenName: 'Chris',
        ppFamilyName: 'Johnson',
        givenName: 'John',
        familyName: 'Smith',
        violationType: 'CURFEW_VIOLATION',
        phoneNumber: '07123456789',
        email: 'chris.johnson@justice.gov.uk',
      }

      await client.triggerNotification(request)

      expect(mockPost).toHaveBeenCalledWith(
        {
          path: '/trigger-notification',
          data: request,
        },
        undefined,
      )
    })
  })
})
