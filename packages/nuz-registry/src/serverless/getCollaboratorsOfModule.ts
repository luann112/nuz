import { Express } from 'express'

import Worker from '../classes/Worker'
import onRoute from '../utils/onRoute'

import { ServerlessRoute } from './types'

export const name = 'getCollaboratorsOfModule'

export const execute: ServerlessRoute = (app: Express, worker: Worker) => {
  app.get(
    '/module/collaborators',
    onRoute(async function (request, response) {
      const { module: id } = request.query

      if (!id) {
        throw new Error(
          'There are not enough fields of information required to process the request.',
        )
      }

      //
      const result = await worker.getCollaboratorsOfModule(id as string)

      //
      response.json(result)

      return true
    }),
  )
}
