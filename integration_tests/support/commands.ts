Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})
