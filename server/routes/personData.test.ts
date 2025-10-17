import request from 'supertest'
import { Express } from 'express'
import { appWithAllRoutes } from './testutils/appSetup'
import { validPersonData, invalidPersonData } from '../testData'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ services: {} })
})

describe('Person Data Routes', () => {
  describe('GET /person-data', () => {
    it('should render person data form', async () => {
      const response = await request(app).get('/person-data')

      expect(response.status).toBe(200)
      expect(response.text).toContain('Person on probation information')
    })
  })

  describe('POST /person-data', () => {
    it('should accept valid data and redirect to trigger-notification', async () => {
      const response = await request(app).post('/person-data').send(validPersonData)

      expect(response.status).toBe(302)
      expect(response.headers.location).toBe('/trigger-notification')
    })

    it('should validate required fields', async () => {
      const response = await request(app).post('/person-data').send({})

      expect(response.status).toBe(200)
      expect(response.text).toContain('Person on probation information')
    })

    it('should validate phone number format', async () => {
      const response = await request(app).post('/person-data').send(invalidPersonData.invalidPhoneNumber)

      expect(response.status).toBe(200)
      expect(response.text).toContain('Enter a valid mobile number')
    })
  })
})
