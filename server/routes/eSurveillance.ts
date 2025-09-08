import { Router, Request } from 'express'
import multer from 'multer'
import axios from 'axios'
import fs from 'fs'
import { Services } from '../services'
import { Page } from '../services/auditService'
import { personsToTable, notificationsToTable } from '../utils/tabularData'
import normaliseQuery from '../utils/normaliseQuery'

interface MulterRequest extends Request {
  file: Express.Multer.File
}

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
      return res.render('pages/person_tabular_data', viewModel)
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
      return res.render('pages/notification_tabular_data', viewModel)
    } catch (error) {
      return next(error)
    }
  })

  router.get('/view-data', async (req, res) => {
    res.render('pages/view-data', { displayBanner: false })
  })

  router.post('/view-data', upload.single('document'), async (req: MulterRequest, res) => {
    if (!req.file) {
      return res.render('pages/index', {
        errorMessages: {
          document: 'File is required',
        },
      })
    }
    const filePath = req.file.path
    const filename = req.file.originalname
    const fileType = req.file.mimetype
    try {
      const presignRes = await eSurveillanceService.getUploadUrl(filename)
      const presignedUrl = presignRes

      const fileStream = fs.createReadStream(filePath)
      const uploadRes = await axios.put(presignedUrl, fileStream, {
        headers: {
          'Content-Type': fileType,
        },
        maxBodyLength: Infinity,
      })

      fs.unlinkSync(filePath)

      if (uploadRes.status === 200) {
        return res.render('pages/view-data', { displayBanner: true })
      }
      return res.render('pages/error', { message: 'Failed to upload file', status: '500', stack: '' })
    } catch (err) {
      return res.render('pages/error', { message: 'Failed to upload file', status: '500', stack: err.message })
    }
  })

  return router
}
