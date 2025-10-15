import request from 'supertest'
import { Express } from 'express'
import { appWithAllRoutes } from './testutils/appSetup'
import ESurveillanceService from '../services/eSurveillanceService'

let app: Express
const mockESurveillanceService = {
  getPersons: jest.fn(),
  getNotifications: jest.fn(),
  getUploadUrl: jest.fn(),
  triggerNotification: jest.fn(),
} as unknown as jest.Mocked<ESurveillanceService>

beforeEach(() => {
  jest.clearAllMocks()
  app = appWithAllRoutes({
    services: {
      eSurveillanceService: mockESurveillanceService,
    },
  })
})

describe('Trigger Notification Routes', () => {
  describe('GET /trigger-notification', () => {
    it('should render trigger notification page', async () => {
      const response = await request(app).get('/trigger-notification')

      expect(response.status).toBe(200)
      expect(response.text).toContain('Trigger notification')
    })
  })

  describe('POST /trigger-notification', () => {
    it('should trigger notification successfully', async () => {
      mockESurveillanceService.triggerNotification.mockResolvedValue()

      // Set up session data first
      const agent = request.agent(app)

      // Set up practitioner data
      await agent.post('/practitioner-data').send({
        ppGivenName: 'Chris',
        ppFamilyName: 'Johnson',
        email: 'chris.johnson@justice.gov.uk',
      })

      // Set up person data
      await agent.post('/person-data').send({
        givenName: 'John',
        familyName: 'Smith',
        phoneNumber: '07123456789',
      })

      const response = await agent.post('/trigger-notification').send({
        violationType: 'MISSING_CURFEW',
      })

      expect(response.status).toBe(200)
      expect(mockESurveillanceService.triggerNotification).toHaveBeenCalled()
    })

    it('should handle notification service errors', async () => {
      mockESurveillanceService.triggerNotification.mockRejectedValue(new Error('Service error'))

      // Set up session data first
      const agent = request.agent(app)

      // Set up practitioner data
      await agent.post('/practitioner-data').send({
        ppGivenName: 'Chris',
        ppFamilyName: 'Johnson',
        email: 'chris.johnson@justice.gov.uk',
      })

      // Set up person data
      await agent.post('/person-data').send({
        givenName: 'John',
        familyName: 'Smith',
        phoneNumber: '07123456789',
      })

      const response = await agent.post('/trigger-notification').send({
        violationType: 'MISSING_CURFEW',
      })

      expect(response.status).toBe(200)
      expect(response.text).toContain('Trigger notification')
    })
  })
})
