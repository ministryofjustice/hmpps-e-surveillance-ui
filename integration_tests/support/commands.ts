Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.request('/notifications')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})
