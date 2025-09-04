import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Services } from '../services'
import { Page } from '../services/auditService'
import { personsToTable, notificationsToTable } from '../utils/tabularData'
import normaliseQuery from '../utils/normaliseQuery'

export default function eSurvRoutes({ auditService, eSurveillanceService }: Services): Router {
  const router = Router()
const csrfDisabledMiddleware = (req, res, next) => {
  // Skip CSRF check
  next()
}
  const uploadFolder = path.join(__dirname, '..', 'uploads')
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder)
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    },
  })

  const upload = multer({ storage })

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

  router.post('/upload', csrfDisabledMiddleware, upload.single('file'), (req, res, next) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.')
    }

    return res.send(`File uploaded successfully: ${req.file.filename}`)
  })



  return router
}
