import { Router, Request, Response, NextFunction } from 'express'
import { UK_PHONE_NUMBER_REGEX } from '../utils/regex'
import { personFieldErrors } from '../utils/fieldConfigs'
import { validateRequiredFields } from '../utils/validators'

export default function personDataRoutes(): Router {
  const router = Router()

  router.get('/person-data', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionErrors = req.session.personDataErrors
      res.render('pages/person_data', {
        errors: sessionErrors?.errors || [],
        errorsByField: sessionErrors?.errorsByField || {},
        data: sessionErrors?.data || {},
      })
      delete req.session.personDataErrors
    } catch (err) {
      next(err)
    }
  })

  router.post('/person-data', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { givenName, familyName, phoneNumber } = req.body

      const { errors, errorsByField, hasErrors } = validateRequiredFields(
        { givenName, familyName, phoneNumber },
        personFieldErrors,
      )

      if (!hasErrors && phoneNumber && !UK_PHONE_NUMBER_REGEX.test(phoneNumber)) {
        errors.push({ text: 'Enter a valid mobile number', href: '#phoneNumber' })
        errorsByField.phoneNumber = { text: 'Enter a valid mobile number' }
      }

      if (errors.length > 0) {
        res.render('pages/person_data', {
          errors,
          errorsByField,
          data: { givenName, familyName, phoneNumber },
        })
      } else {
        req.session.personData = { givenName, familyName, phoneNumber }
        res.redirect('/trigger-notification')
      }
    } catch (err) {
      next(err)
    }
  })

  return router
}
