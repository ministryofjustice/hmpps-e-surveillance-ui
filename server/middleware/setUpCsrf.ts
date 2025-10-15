import { Router } from 'express'
import { csrfSync } from 'csrf-sync'

const testMode = process.env.NODE_ENV === 'test'

export default function setUpCsrf(): Router {
  const router = Router({ mergeParams: true })

  const { csrfSynchronisedProtection, generateToken } = csrfSync({
    getTokenFromRequest: req => req.body?._csrf,
  }) as ReturnType<typeof csrfSync> & {
    generateToken: (req: Express.Request, overwrite?: boolean) => string
  }

  if (!testMode) {
    router.use(csrfSynchronisedProtection)
  }

  router.use((req, res, next) => {
    res.locals.csrfToken = generateToken(req as any)
    next()
  })

  return router
}
