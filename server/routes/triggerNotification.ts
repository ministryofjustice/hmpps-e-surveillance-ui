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
    const { givenName, familyName, phoneNumber } = req.session.personData
    const { ppGivenName, ppFamilyName, email } = req.session.practitionerData

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
