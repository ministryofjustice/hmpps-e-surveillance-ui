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

  router.get('/cases', async (req, res, next) => {
    try {
      await auditService.logPageView(Page.ESURVEILLANCE_PERSONS, {
        who: res.locals.user.username,
        correlationId: req.id,
      })

      const personsResponse = await eSurveillanceService.getPersons(normaliseQuery(req.query))
      const persons = personsResponse?.content ?? []
      const currentPageNumber = parseInt(req.query.page as string, 10) || 1
      const totalElements = personsResponse?.totalElements ?? 0
      const pageSize = personsResponse?.pageable?.pageSize ?? 0
      const searchText = req.query?.search as string
      const viewModel = personsToTable(persons, currentPageNumber, totalElements, pageSize, searchText)
      return res.render('pages/tabular_data', viewModel)
    } catch (error) {
      return next(error)
    }
  })

  router.get('/notifications', async (req, res, next) => {
    return res.render('pages/index')
    //     try {
    //       await auditService.logPageView(Page.ESURVEILLANCE_NOTIFICATIONS, {
    //         who: res.locals.user.username,
    //         correlationId: req.id,
    //       })
    //       const notificationsResponse = await eSurveillanceService.getNotifications(normaliseQuery(req.query))
    //       const notifications = notificationsResponse?.content ?? []
    //       const currentPageNumber = parseInt(req.query.page as string, 10) || 1
    //       const totalElements = notificationsResponse?.totalElements ?? 0
    //       const pageSize = notificationsResponse?.pageable?.pageSize ?? 0
    //       const searchText = req.query?.search as string
    //       const viewModel = notificationsToTable(notifications, currentPageNumber, totalElements, pageSize, searchText)
    //       return res.render('pages/tabular_data', viewModel)
    //     } catch (error) {
    //       return next(error)
    //     }
  })

  router.get('/upload', async (req, res) => {
    res.render('pages/upload', { displayBanner: false })
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
        const files = req.files
        const uploads = []
        if (
          (!files.personFile || files.personFile.length === 0) &&
          (!files.eventFile || files.eventFile.length === 0)
        ) {
          return res.render('pages/upload', {
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

        return res.render('pages/upload', { displayBanner: true })
      } catch (err) {
        return next(err)
      }
    },
  )

  return router
}
