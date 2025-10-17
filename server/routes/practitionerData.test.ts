import request from 'supertest'
import { Express } from 'express'
import { appWithAllRoutes } from './testutils/appSetup'
import { validPractitionerData, invalidPractitionerData } from '../testData'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ services: {} })
})

describe('Practitioner Data Routes', () => {
  describe('GET /practitioner-data', () => {
    it('should render practitioner data form', async () => {
      const response = await request(app).get('/practitioner-data')

      expect(response.status).toBe(200)
      expect(response.text).toContain('Probation practitioner notification')
    })
  })

  describe('POST /practitioner-data', () => {
    it('should accept valid data and redirect to person-data', async () => {
      const response = await request(app).post('/practitioner-data').send(validPractitionerData)

      expect(response.status).toBe(302)
      expect(response.headers.location).toBe('/person-data')
    })

    it('should validate required fields', async () => {
      const response = await request(app).post('/practitioner-data').send({})

      expect(response.status).toBe(200)
      expect(response.text).toContain('Probation practitioner notification')
    })

    it('should validate email format', async () => {
      const response = await request(app).post('/practitioner-data').send(invalidPractitionerData.invalidEmail)

      expect(response.status).toBe(200)
      expect(response.text).toContain('Enter a valid email address')
    })
  })
})
