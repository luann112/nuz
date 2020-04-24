import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'createUser'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.post(
    '/user/token',
    onRoute(async (request, response) => {
      const { token, type } = request.body

      const formIsMissing = !token || !type
      if (formIsMissing) {
        throw new Error('Form is missing fields')
      }

      const item = await worker.createTokenForUser(token, type)

      response.json(item)
      return true
    }),
  )
}
