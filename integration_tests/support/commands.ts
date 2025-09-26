// Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
//   cy.request('/')
//   return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
// })
cy.request({
  url: '/',
  followRedirect: false, // Don’t follow to see where it goes
  failOnStatusCode: false, // Prevent 302 from throwing
}).then(response => {
  expect(response.status).to.eq(302)
  expect(response.redirectedToUrl).to.include('/notifications')
})
