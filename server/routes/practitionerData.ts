import { Router, Request, Response, NextFunction } from 'express'
import { EMAIL_REGEX } from '../utils/regex'

export default function practitionerDataRoutes(): Router {
  interface PractitionerData {
    ppGivenName: string
    ppFamilyName: string
    email: string
  }

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
      const { ppGivenName, ppFamilyName, email } = req.body as PractitionerData

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
      } else if (!EMAIL_REGEX.test(email)) {
        errors.push({ text: 'Enter a valid email address', href: '#email' })
        errorsByField.email = { text: 'Enter a valid email address' }
      }

      if (errors.length > 0) {
        res.render('pages/practitioner_data', {
          errors,
          errorsByField,
          data: {
            ppGivenName,
            ppFamilyName,
            email,
          },
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
