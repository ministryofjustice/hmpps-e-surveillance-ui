import { Router, Request, Response, NextFunction } from 'express'
import { EMAIL_REGEX } from '../utils/regex'
import { practitionerFieldErrors } from '../utils/fieldConfigs'
import { validateRequiredFields } from '../utils/validators'

export default function practitionerDataRoutes(): Router {
  const router = Router()

  router.get('/practitioner-data', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionErrors = req.session.practitionerDataErrors
      res.render('pages/practitioner_data', {
        errors: sessionErrors?.errors || [],
        errorsByField: sessionErrors?.errorsByField || {},
        data: sessionErrors?.data || {},
      })
      delete req.session.practitionerDataErrors
    } catch (err) {
      next(err)
    }
  })

  router.post('/practitioner-data', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ppGivenName, ppFamilyName, email } = req.body

      const { errors, errorsByField, hasErrors } = validateRequiredFields(
        { ppGivenName, ppFamilyName, email },
        practitionerFieldErrors,
      )

      if (!hasErrors && email && !EMAIL_REGEX.test(email)) {
        errors.push({ text: 'Enter a valid email address', href: '#email' })
        errorsByField.email = { text: 'Enter a valid email address' }
      }

      if (errors.length > 0) {
        res.render('pages/practitioner_data', {
          errors,
          errorsByField,
          data: { ppGivenName, ppFamilyName, email },
        })
      } else {
        req.session.practitionerData = { ppGivenName, ppFamilyName, email }
        res.redirect('/person-data')
      }
    } catch (err) {
      next(err)
    }
  })

  return router
}
