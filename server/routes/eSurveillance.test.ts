import request from 'supertest'
import fs from 'fs'
import superagent from 'superagent'
import { Express } from 'express'
import { appWithAllRoutes } from './testutils/appSetup'
import ESurveillanceService from '../services/eSurveillanceService'
import { mockPersonsApiResponse, mockNotificationsApiResponse } from '../testData'

jest.mock('fs')
jest.mock('superagent')

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

  const mockFs = fs as jest.Mocked<typeof fs>
  mockFs.readFileSync = jest.fn().mockImplementation((filePath: string) => {
    if (typeof filePath === 'string' && filePath.includes('person')) {
      return Buffer.from(
        mockPersonsApiResponse.content
          .map(
            p =>
              `${p.deliusId},${p.uniqueDeviceWearerId},${p.personId},${p.givenName},${p.familyName},${p.alias},${p.createdAt},${p.toy}`,
          )
          .join('\n'),
      )
    }
    return Buffer.from('test,data\nvalue1,value2')
  })

  const mockSuperagent = superagent as jest.Mocked<typeof superagent>
  mockSuperagent.put = jest.fn().mockReturnValue({
    set: jest.fn().mockReturnThis(),
    send: jest.fn().mockResolvedValue({}),
  })
})

describe('E-Surveillance Route Logic (Unit Tests)', () => {
  const eSurvRoutes = require('./eSurveillance').default

  describe('GET /cases route handler', () => {
    it('should call auditService.logPageView and eSurveillanceService.getPersons', async () => {
      mockESurveillanceService.getPersons.mockResolvedValue(mockPersonsApiResponse)

      const mockReq = {
        query: { search: 'test', page: '2' },
        id: 'test-correlation-id',
      }
      const mockRes = {
        locals: { user: { username: 'test-user' } },
        render: jest.fn(),
      }
      const mockNext = jest.fn()

      const mockAuditService = {
        logPageView: jest.fn().mockResolvedValue(undefined),
      }

      const router = eSurvRoutes({
        auditService: mockAuditService,
        eSurveillanceService: mockESurveillanceService,
      })

      const routes = router.stack
      const casesRoute = routes.find((r: any) => r.route?.path === '/cases' && r.route?.methods?.get)

      expect(casesRoute).toBeDefined()

      await casesRoute.route.stack[0].handle(mockReq, mockRes, mockNext)

      expect(mockAuditService.logPageView).toHaveBeenCalledWith('ESURVEILLANCE_PERSONS', {
        who: 'test-user',
        correlationId: 'test-correlation-id',
      })

      expect(mockESurveillanceService.getPersons).toHaveBeenCalledWith({
        search: 'test',
        page: '2',
      })

      expect(mockRes.render).toHaveBeenCalledWith(
        'pages/tabular_data',
        expect.objectContaining({
          title: expect.any(String),
          headers: expect.any(Array),
          rows: expect.any(Array),
          pagination: expect.any(Object),
        }),
      )
    })

    it('should handle empty query parameters', async () => {
      mockESurveillanceService.getPersons.mockResolvedValue(mockPersonsApiResponse)

      const mockReq = {
        query: {},
        id: 'test-correlation-id',
      }
      const mockRes = {
        locals: { user: { username: 'test-user' } },
        render: jest.fn(),
      }
      const mockNext = jest.fn()

      const mockAuditService = {
        logPageView: jest.fn().mockResolvedValue(undefined),
      }

      const router = eSurvRoutes({
        auditService: mockAuditService,
        eSurveillanceService: mockESurveillanceService,
      })

      const routes = router.stack
      const casesRoute = routes.find((r: any) => r.route?.path === '/cases' && r.route?.methods?.get)

      await casesRoute.route.stack[0].handle(mockReq, mockRes, mockNext)

      expect(mockESurveillanceService.getPersons).toHaveBeenCalledWith({})
    })
  })

  describe('GET /notifications route handler', () => {
    it('should call auditService.logPageView and eSurveillanceService.getNotifications', async () => {
      mockESurveillanceService.getNotifications.mockResolvedValue(mockNotificationsApiResponse)

      const mockReq = {
        query: { search: 'violation' },
        id: 'test-correlation-id',
      }
      const mockRes = {
        locals: { user: { username: 'test-user' } },
        render: jest.fn(),
      }
      const mockNext = jest.fn()

      const mockAuditService = {
        logPageView: jest.fn().mockResolvedValue(undefined),
      }

      const router = eSurvRoutes({
        auditService: mockAuditService,
        eSurveillanceService: mockESurveillanceService,
      })

      const routes = router.stack
      const notificationsRoute = routes.find((r: any) => r.route?.path === '/notifications' && r.route?.methods?.get)

      expect(notificationsRoute).toBeDefined()

      await notificationsRoute.route.stack[0].handle(mockReq, mockRes, mockNext)

      expect(mockAuditService.logPageView).toHaveBeenCalledWith('ESURVEILLANCE_NOTIFICATIONS', {
        who: 'test-user',
        correlationId: 'test-correlation-id',
      })

      expect(mockESurveillanceService.getNotifications).toHaveBeenCalledWith({
        search: 'violation',
      })

      expect(mockRes.render).toHaveBeenCalledWith(
        'pages/tabular_data',
        expect.objectContaining({
          title: expect.any(String),
          headers: expect.any(Array),
          rows: expect.any(Array),
          pagination: expect.any(Object),
        }),
      )
    })
  })

  describe('GET /upload route handler', () => {
    it('should render upload page', async () => {
      const mockReq = {}
      const mockRes = {
        render: jest.fn(),
      }

      const router = eSurvRoutes({
        auditService: {} as any,
        eSurveillanceService: mockESurveillanceService,
      })

      const routes = router.stack
      const uploadRoute = routes.find((r: any) => r.route?.path === '/upload' && r.route?.methods?.get)

      expect(uploadRoute).toBeDefined()

      await uploadRoute.route.stack[0].handle(mockReq, mockRes)

      expect(mockRes.render).toHaveBeenCalledWith('pages/upload', { displayBanner: false })
    })
  })

  describe('Error handling', () => {
    it('should call next() when audit service fails', async () => {
      const mockReq = {
        query: {},
        id: 'test-correlation-id',
      }
      const mockRes = {
        locals: { user: { username: 'test-user' } },
        render: jest.fn(),
      }
      const mockNext = jest.fn()

      const mockAuditService = {
        logPageView: jest.fn().mockRejectedValue(new Error('Audit service error')),
      }

      const router = eSurvRoutes({
        auditService: mockAuditService,
        eSurveillanceService: mockESurveillanceService,
      })

      const routes = router.stack
      const casesRoute = routes.find((r: any) => r.route?.path === '/cases' && r.route?.methods?.get)

      await casesRoute.route.stack[0].handle(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error))
    })

    it('should call next() when eSurveillanceService fails', async () => {
      mockESurveillanceService.getPersons.mockRejectedValue(new Error('Service error'))

      const mockReq = {
        query: {},
        id: 'test-correlation-id',
      }
      const mockRes = {
        locals: { user: { username: 'test-user' } },
        render: jest.fn(),
      }
      const mockNext = jest.fn()

      const mockAuditService = {
        logPageView: jest.fn().mockResolvedValue(undefined),
      }

      const router = eSurvRoutes({
        auditService: mockAuditService,
        eSurveillanceService: mockESurveillanceService,
      })

      const routes = router.stack
      const casesRoute = routes.find((r: any) => r.route?.path === '/cases' && r.route?.methods?.get)

      await casesRoute.route.stack[0].handle(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error))
    })
  })
})
