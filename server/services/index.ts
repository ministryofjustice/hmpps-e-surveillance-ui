import { dataAccess } from '../data'
import AuditService from './auditService'
import ESurveillanceService from './eSurveillanceService'
import ExampleService from './exampleService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, exampleApiClient, eSurveillanceApiClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    exampleService: new ExampleService(exampleApiClient),
    eSurveillanceService: new ESurveillanceService(eSurveillanceApiClient),
  }
}

export type Services = ReturnType<typeof services>
