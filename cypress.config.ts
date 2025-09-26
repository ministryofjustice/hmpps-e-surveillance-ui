import { defineConfig } from 'cypress'
import { stubFor, resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import exampleApi from './integration_tests/mockApis/exampleApi'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        stubNotifications: () =>
          stubFor({
            request: {
              method: 'GET',
              urlPattern: '/notifications',
            },
            response: {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
              jsonBody: {
                content: [
                  { id: 1, title: 'Test Notification 1' },
                  { id: 2, title: 'Test Notification 2' },
                ],
                totalElements: 2,
                pageable: { pageSize: 20 },
              },
            },
          }),
        reset: resetStubs,
        ...auth,
        ...tokenVerification,
        ...exampleApi,
      })
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
  },
})
