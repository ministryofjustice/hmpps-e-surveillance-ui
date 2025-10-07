import { Router, Request, Response, NextFunction } from 'express'
import logger from '../../logger'
import { Services } from '../services'
import { Page } from '../services/auditService'
import { TriggerNotificationRequest } from '../data/eSurveillanceClient'

export default function triggerNotificationRoutes({ auditService, eSurveillanceService }: Services): Router {
  interface GovukError {
    text: string
    href: string
  }

  interface ErrorsByField {
    [fieldName: string]: {
      text: string
    }
  }

  const router = Router()

  router.get('/trigger-notification', async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('pages/trigger_notification')
    } catch (err) {
      next(err)
    }
  })

  router.post('/trigger-notification', async (req: Request, res: Response, next: NextFunction) => {
    const { violationType } = req.body
    const { givenName, familyName, phoneNumber } = req.session.personData || {}
    const { ppGivenName, ppFamilyName, email } = req.session.practitionerData || {}

    if (!givenName || !familyName || !phoneNumber) {
      logger.error('Missing person data')
      const errors: GovukError[] = []
      const errorsByField: ErrorsByField = {}

      if (!givenName) {
        errors.push({ text: 'Enter first name', href: '#given-name' })
        errorsByField.givenName = { text: 'Enter first name' }
      }

      if (!familyName) {
        errors.push({ text: 'Enter last name', href: '#family-name' })
        errorsByField.familyName = { text: 'Enter last name' }
      }

      if (!phoneNumber) {
        errors.push({ text: 'Enter mobile number', href: '#phoneNumber' })
        errorsByField.phoneNumber = { text: 'Enter mobile number' }
      }

      req.session.personDataErrors = {
        errors,
        errorsByField,
        data: { givenName, familyName, phoneNumber },
      }

      return res.redirect('/person-data')
    }

    if (!ppGivenName || !ppFamilyName || !email) {
      logger.error('Missing practitioner data')

      const errors: GovukError[] = []
      const errorsByField: ErrorsByField = {}

      if (!ppGivenName || ppGivenName.trim() === '') {
        errors.push({ text: 'Enter first name', href: '#first-name' })
        errorsByField.ppGivenName = { text: 'Enter first name' }
      }

      if (!ppFamilyName || ppFamilyName.trim() === '') {
        errors.push({ text: 'Enter last name', href: '#family-name' })
        errorsByField.ppFamilyName = { text: 'Enter last name' }
      }

      if (!email || email.trim() === '') {
        errors.push({ text: 'Enter email address', href: '#email' })
        errorsByField.email = { text: 'Enter email address' }
      }

      req.session.practitionerDataErrors = {
        errors,
        errorsByField,
        data: { ppGivenName, ppFamilyName, email },
      }
      return res.redirect('/practitioner-data')
    }

    try {
      const errors: GovukError[] = []
      const errorsByField: ErrorsByField = {}

      if (!violationType) {
        errors.push({ text: 'Select an option', href: '#violationType' })
        errorsByField.violationType = { text: 'Select an option' }
      }

      if (errors.length > 0) {
        res.render('pages/trigger_notification', {
          errors,
          errorsByField,
        })
      } else {
        const request: TriggerNotificationRequest = {
          ppGivenName,
          ppFamilyName,
          givenName,
          familyName,
          violationType,
          email,
          phoneNumber,
        }
        const resp = await eSurveillanceService.triggerNotification(request)
        logger.info('Notification triggered successfully')
        res.render('pages/trigger_notification', { email, phoneNumber, status: 'success' })
      }
    } catch (error) {
      logger.error('Error triggering notification', error)
      res.render('pages/trigger_notification', { email, phoneNumber, status: 'failed' })
    }
  })

  return router
}
