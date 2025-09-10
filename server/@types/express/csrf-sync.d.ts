import { Request, Response, NextFunction, RequestHandler } from 'express'

declare module 'csrf-sync' {
  export interface CsrfRequest extends Request {
    body?: { _csrf?: string }
  }

  export interface CsrfSyncOptions<Req extends Request = CsrfRequest> {
    getTokenFromRequest?: (req: Req) => string | undefined
  }

  export interface CsrfSyncInstance {
    generateToken: (req: Request, res: Response) => string
    getTokenFromRequest: (req: Request) => string | undefined
    invalidTokenHandler: (req: Request, res: Response, next: NextFunction) => void
    validateToken: (req: Request, res: Response) => boolean
  }

  export function csrfSync<Req extends Request = CsrfRequest>(
    options?: CsrfSyncOptions<Req>,
  ): {
    csrfSynchronisedProtection: RequestHandler
    options: CsrfSyncOptions<Req>
  }
}
