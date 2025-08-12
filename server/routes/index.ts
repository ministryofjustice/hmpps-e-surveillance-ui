import express, { Request, Response, NextFunction, Router } from 'express'

import type { Services } from '../services'
// import { Page } from '../services/auditService'
import { httpService } from '../services/httpService'

export default function routes({ auditService }: Services): Router {
  const router = Router()

  router.get('/', async (req, res, next) => {
    // await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    // const currentTime = await exampleService.getCurrentTime()
    return res.render('pages/index')
  })
  router.get('/persons', async (req, res, next) => {
    const data = await httpService.persons()

    if (data) {
      const mappedContent = data.content.map(
        ({ id, deliusId, uniqueDeviceWearerId, personId, givenName, familyName, alias, createdAt, toy }) => [
          { text: id },
          { text: deliusId },
          { text: uniqueDeviceWearerId },
          { text: personId },
          { text: givenName },
          { text: familyName },
          { text: alias },
          { text: new Date(createdAt).toLocaleString() },
          { text: toy },
        ],
      )
      const title = 'persons'
      const caption = title
      const personData = {
        caption,
        title,
        headers: [
          { text: 'id' },
          { text: 'Delius Id' },
          { text: 'Unique Device Wearer Id' },
          { text: 'Person Id' },
          { text: 'Given Name' },
          { text: 'Family Name' },
          { text: 'Alias' },
          { text: 'Created At' },
          { text: 'Toy' },
        ],
        rows: mappedContent,
        notFoundMessage: 'Nothing yet',
      }
      return res.render('pages/tabular_data', personData)
    }
    console.log('No person data')
    return res.render('pages/tabular_data', {})
  })

  router.get('/notifications', async (req, res, next) => {
    const data = await httpService.notifications()

    if (data) {
      const mappedContent = data.content.map(({ id, violation, message, timestamp }) => [
        { text: id },
        { text: violation },
        { html: message ? message.replaceAll('\n\n', '<br/>') : message },
        { text: new Date(timestamp).toLocaleString() },
      ])
      const title = 'Notifications'
      const caption = title
      const notifications = {
        caption,
        title,
        headers: [
          {
            text: 'Id',
          },
          {
            text: 'Violation type',
          },
          {
            text: 'Message',
          },
          {
            text: 'Date',
          },
        ],
        rows: mappedContent,
        notFoundMessage: 'Nothing yet',
      }
      return res.render('pages/tabular_data', notifications)
    }
    console.log('no notifications')
    return res.render('pages/tabular_data', {})
  })

  return router
}
