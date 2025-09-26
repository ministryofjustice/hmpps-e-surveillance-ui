Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.request({ url: '/', failOnStatusCode: false })
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})
