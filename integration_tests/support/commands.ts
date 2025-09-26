// Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
//   cy.request('/')
//   return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
// })
Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  return cy
    .request({
      url: '/',
      followRedirect: false,
      failOnStatusCode: false,
    })
    .then(response => {
      expect(response.status).to.eq(302)
      expect(response.redirectedToUrl).to.include('/notifications')

      return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
    })
})
