import { Router, Request, Response, NextFunction } from 'express'
import { UK_PHONE_NUMBER_REGEX, EMAIL_REGEX } from '../utils/regex'

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
      res.render('pages/practitioner_data', {
        data: {},
        errors: [],
        errorsByField: {},
      })
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
        errors.push({ text: 'Enter your name', href: '#first-name' })
        errorsByField.ppGivenName = { text: 'Enter your name' }
      }

      if (!ppFamilyName || ppFamilyName.trim() === '') {
        errors.push({ text: 'Enter your surname', href: '#family-name' })
        errorsByField.ppFamilyName = { text: 'Enter your surname' }
      }

      if (!email || email.trim() === '') {
        errors.push({ text: 'Enter your email address', href: '#email' })
        errorsByField.email = { text: 'Enter your email address' }
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
        res.render('pages/set_localstorage', {
          data: JSON.stringify({ ppGivenName, ppFamilyName, email }),
          key: 'practitionerData',
          redirectUrl: '/person-data',
        })
      }
    } catch (err) {
      next(err)
    }
  })

  return router
}
