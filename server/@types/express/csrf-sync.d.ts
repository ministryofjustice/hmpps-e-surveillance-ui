declare module 'csrf-sync' {
  export interface CsrfSyncOptions {
    getTokenFromRequest?: (req: any) => string | undefined
  }

  export interface CsrfSyncInstance {
    generateToken: (req: Express.Request, res: Express.Response) => string
    getTokenFromRequest: (req: Express.Request) => string | undefined
    invalidTokenHandler: (req: Express.Request, res: Express.Response, next: Express.NextFunction) => void
    validateToken: (req: Express.Request, res: Express.Response) => boolean
  }

  export function csrfSync(options?: CsrfSyncOptions): {
    csrfSynchronisedProtection: (req: Express.Request, res: Express.Response, next: Express.NextFunction) => void
    options: CsrfSyncOptions
  }
}
