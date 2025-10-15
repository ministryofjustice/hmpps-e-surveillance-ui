import { dataAccess } from '../data'
import AuditService from './auditService'
import ESurveillanceService from './eSurveillanceService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, eSurveillanceApiClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    eSurveillanceService: new ESurveillanceService(eSurveillanceApiClient),
  }
}

export type Services = ReturnType<typeof services>
