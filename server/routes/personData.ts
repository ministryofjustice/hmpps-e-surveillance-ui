import { Router, Request, Response, NextFunction } from 'express'
import { UK_PHONE_NUMBER_REGEX } from '../utils/regex'

export default function personDataRoutes(): Router {
  interface PersonData {
    givenName: string
    familyName: string
    phoneNumber: string
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

  router.get('/person-data', async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('pages/person_data', {
        data: {},
        errors: [],
        errorsByField: {},
      })
    } catch (err) {
      next(err)
    }
  })

  router.post('/person-data', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { givenName, familyName, phoneNumber } = req.body as PersonData

      const errors: GovukError[] = []
      const errorsByField: ErrorsByField = {}

      if (!givenName || givenName.trim() === '') {
        errors.push({ text: 'Enter your name', href: '#first-name' })
        errorsByField.givenName = { text: 'Enter your name' }
      }

      if (!familyName || familyName.trim() === '') {
        errors.push({ text: 'Enter your surname', href: '#family-name' })
        errorsByField.familyName = { text: 'Enter your surname' }
      }

      if (!phoneNumber || phoneNumber.trim() === '') {
        errors.push({ text: 'Enter your mobile number', href: '#phoneNumber' })
        errorsByField.mobile = { text: 'Enter your mobile number' }
      } else if (!UK_PHONE_NUMBER_REGEX.test(phoneNumber)) {
        errors.push({ text: 'Enter a valid mobile number', href: '#phoneNumber' })
        errorsByField.phoneNumber = { text: 'Enter a valid mobile number' }
      }

      if (errors.length > 0) {
        res.render('pages/person_data', {
          errors,
          errorsByField,
          data: {
            givenName,
            familyName,
            phoneNumber,
          },
        })
      } else {
        res.render('pages/set_localstorage', {
          data: JSON.stringify({ givenName, familyName, phoneNumber }),
          key: 'personData',
          redirectUrl: '/trigger-notification',
        })
      }
    } catch (err) {
      next(err)
    }
  })

  return router
}
