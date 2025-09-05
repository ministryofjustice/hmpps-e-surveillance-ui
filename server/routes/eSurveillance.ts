import { Router } from 'express'
import { Services } from '../services'
import { Page } from '../services/auditService'
import { personsToTable, notificationsToTable } from '../utils/tabularData'
import normaliseQuery from '../utils/normaliseQuery'

export default function eSurvRoutes({ auditService, eSurveillanceService }: Services): Router {
  const router = Router()

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

  router.post('/upload', (req, res) => {
      return res.render('pages/view-data', { displayBanner: true } )
  });



  return router
}
