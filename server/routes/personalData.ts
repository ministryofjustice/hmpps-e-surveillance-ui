import { Router, Request, Response, NextFunction } from 'express'
import { UK_PHONE_NUMBER_REGEX, EMAIL_REGEX } from '../utils/regex'

export default function personalDataRoutes(): Router {
  interface PersonalData {
    firstName: string
    familyName: string
    email: string
    mobile: string
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

  router.get('/personal-data', async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('pages/personal_data', {
        data: {},
        errors: [],
        errorsByField: {},
      })
    } catch (err) {
      next(err)
    }
  })

  router.post('/personal-data', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, familyName, email, mobile } = req.body as PersonalData

      const errors: GovukError[] = []
      const errorsByField: ErrorsByField = {}

      if (!firstName || firstName.trim() === '') {
        errors.push({ text: 'Enter your name', href: '#first-name' })
        errorsByField.firstName = { text: 'Enter your name' }
      }

      if (!familyName || familyName.trim() === '') {
        errors.push({ text: 'Enter your surname', href: '#family-name' })
        errorsByField.familyName = { text: 'Enter your surname' }
      }

      if (!email || email.trim() === '') {
        errors.push({ text: 'Enter your email address', href: '#email' })
        errorsByField.email = { text: 'Enter your email address' }
      } else if (!EMAIL_REGEX.test(email)) {
        errors.push({ text: 'Enter a valid email address', href: '#email' })
        errorsByField.email = { text: 'Enter a valid email address' }
      }

      if (!mobile || mobile.trim() === '') {
        errors.push({ text: 'Enter your mobile number', href: '#mobile' })
        errorsByField.mobile = { text: 'Enter your mobile number' }
      } else if (!UK_PHONE_NUMBER_REGEX.test(mobile)) {
        errors.push({ text: 'Enter a valid mobile number', href: '#mobile' })
        errorsByField.mobile = { text: 'Enter a valid mobile number' }
      }

      if (errors.length > 0) {
        res.render('pages/personal_data', {
          errors,
          errorsByField,
          data: {
            firstName,
            familyName,
            email,
            mobile,
          },
        })
      } else {
        res.render('pages/set_localstorage', {
          data: JSON.stringify({ firstName, familyName, email, mobile }),
          key: 'personalData',
          redirectUrl: '/trigger-notification',
        })
      }
    } catch (err) {
      next(err)
    }
  })

  return router
}
