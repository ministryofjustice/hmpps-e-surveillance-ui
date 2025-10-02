import { Router, Request, Response, NextFunction } from 'express'
import { Services } from '../services'
import { Page } from '../services/auditService'

export default function triggerNotificationRoutes({ auditService, eSurveillanceService }: Services): Router {
  const router = Router()

  router.get('/trigger-notification', async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('pages/trigger_notification')
    } catch (err) {
      next(err)
    }
  })

  return router
}
