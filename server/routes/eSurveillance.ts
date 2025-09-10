/* eslint-disable no-await-in-loop */
import { Router } from 'express'
import multer from 'multer'
import superagent from 'superagent'
import fs from 'fs'
import path from 'path'
import { Services } from '../services'
import { Page } from '../services/auditService'
import { personsToTable, notificationsToTable } from '../utils/tabularData'
import normaliseQuery from '../utils/normaliseQuery'

export default function eSurvRoutes({ auditService, eSurveillanceService }: Services): Router {
  const router = Router()
  const upload = multer({ dest: 'temp/' })

  router.get('/persons', async (req, res, next) => {
    try {
      await auditService.logPageView(Page.ESURVEILLANCE_PERSONS, {
        who: res.locals.user.username,
        correlationId: req.id,
      })

      const persons = await eSurveillanceService.getPersons(normaliseQuery(req.query))
      const viewModel = personsToTable(persons)
      return res.render('pages/tabular_data', viewModel)
    } catch (error) {
      return next(error)
    }
  })

  router.get('/notifications', async (req, res, next) => {
    try {
      await auditService.logPageView(Page.ESURVEILLANCE_NOTIFICATIONS, {
        who: res.locals.user.username,
        correlationId: req.id,
      })

      const notifications = await eSurveillanceService.getNotifications(normaliseQuery(req.query))
      const viewModel = notificationsToTable(notifications)
      return res.render('pages/tabular_data', viewModel)
    } catch (error) {
      return next(error)
    }
  })

  router.get('/view-data', async (req, res) => {
    res.render('pages/view-data', { displayBanner: false })
  })

  router.post(
    '/upload',
    upload.fields([
      { name: 'personFile', maxCount: 1 },
      { name: 'eventFile', maxCount: 1 },
    ]),
    async (req, res, next) => {
      try {
        const now = new Date()
        const timestamp = now.toISOString().replace(/[:.]/g, '-')
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const files = req.files as any
        const uploads = []

        if (!files.personFile || !files.eventFile) {
          return res.render('pages/index', {
            errorMessages: {
              personFile: 'At least one file is required',
            },
          })
        }

        if (files.personFile) {
          const file = files.personFile[0]
          const newName = `person_${timestamp}${path.extname(file.originalname)}`
          uploads.push({ file, newName })
        }

        if (files.eventFile) {
          const file = files.eventFile[0]
          const newName = `event_${timestamp}${path.extname(file.originalname)}`
          uploads.push({ file, newName })
        }

        for (const { file, newName } of uploads) {
          const signedUrl = await eSurveillanceService.getUploadUrl(newName)

          await superagent.put(signedUrl).set('Content-Type', file.mimetype).send(fs.readFileSync(file.path))
        }

        return res.render('pages/view-data', { displayBanner: true })
      } catch (err) {
        return next(err)
      }
    },
  )

  return router
}
