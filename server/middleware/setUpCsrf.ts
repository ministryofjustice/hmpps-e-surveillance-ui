import { Router } from 'express'
import { csrfSync } from 'csrf-sync'

const testMode = process.env.NODE_ENV === 'test'

export default function setUpCsrf(): Router {
  const router = Router({ mergeParams: true })

  const csrf = csrfSync({
    getTokenFromRequest: req => req.body?._csrf,
    skipCsrfProtection: req => {
      // Skip CSRF for upload route (will be validated manually after multer parses body)
      return req.path === '/upload' && req.method === 'POST'
    },
  }) as ReturnType<typeof csrfSync> & {
    generateToken: (req: Express.Request, overwrite?: boolean) => string
    isRequestValid: (req: Express.Request) => boolean
  }

  if (!testMode) {
    router.use(csrf.csrfSynchronisedProtection)
  }

  router.use((req, res, next) => {
    res.locals.csrfToken = csrf.generateToken(req as any)
    res.locals.csrfValidate = csrf.isRequestValid
    next()
  })

  return router
}
