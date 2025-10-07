import { Router, Request, Response, NextFunction } from 'express'
import logger from '../../logger'
import { Services } from '../services'
import { Page } from '../services/auditService'
import { TriggerNotificationRequest } from '../data/eSurveillanceClient'
import { personFieldErrors, practitionerFieldErrors, violationTypeFieldErrors } from '../utils/fieldConfigs'
import { validateRequiredFields } from '../utils/validators'

export default function triggerNotificationRoutes({ auditService, eSurveillanceService }: Services): Router {
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

    const practitionerValidation = validateRequiredFields({ ppGivenName, ppFamilyName, email }, practitionerFieldErrors)

    if (practitionerValidation.hasErrors) {
      req.session.practitionerDataErrors = {
        errors: practitionerValidation.errors,
        errorsByField: practitionerValidation.errorsByField,
        data: { ppGivenName, ppFamilyName, email },
      }
      return res.redirect('/practitioner-data')
    }

    const personValidation = validateRequiredFields({ givenName, familyName, phoneNumber }, personFieldErrors)

    if (personValidation.hasErrors) {
      req.session.personDataErrors = {
        errors: personValidation.errors,
        errorsByField: personValidation.errorsByField,
        data: { givenName, familyName, phoneNumber },
      }
      return res.redirect('/person-data')
    }

    try {
      const { errors, errorsByField, hasErrors } = validateRequiredFields({ violationType }, violationTypeFieldErrors)

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
