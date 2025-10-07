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
      const { givenName, familyName, phoneNumber } = req.body as PersonData

      const errors: GovukError[] = []
      const errorsByField: ErrorsByField = {}

      if (!givenName || givenName.trim() === '') {
        errors.push({ text: 'Enter first name', href: '#first-name' })
        errorsByField.givenName = { text: 'Enter first name' }
      }

      if (!familyName || familyName.trim() === '') {
        errors.push({ text: 'Enter last name', href: '#family-name' })
        errorsByField.familyName = { text: 'Enter last name' }
      }

      if (!phoneNumber || phoneNumber.trim() === '') {
        errors.push({ text: 'Enter mobile number', href: '#phoneNumber' })
        errorsByField.phoneNumber = { text: 'Enter mobile number' }
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
        req.session.personData = { givenName, familyName, phoneNumber }
        res.redirect('/trigger-notification')
      }
    } catch (err) {
      next(err)
    }
  })

  return router
}
