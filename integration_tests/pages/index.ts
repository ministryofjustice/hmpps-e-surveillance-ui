import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('EM notifications for people on probation')
  }

  headerUserName = (): PageElement => cy.get('a.moj-header__navigation-link[aria-current="page"]')
}
