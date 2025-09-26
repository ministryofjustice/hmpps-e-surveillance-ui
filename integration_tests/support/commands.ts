Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.signIn()
  cy.request('/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})

// Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
//   return cy.task('getSignInUrl').then((url: string) => {
//     cy.log(`Signing in via URL: ${url}`)
//     return cy.visit(url, options)
//   })
// })
