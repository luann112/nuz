import express from 'express'

export type RouteHandler = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) => Promise<any>

const onRoute = (fn: RouteHandler) => async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) => {
  try {
    return await fn(request, response, next)
  } catch (error) {
    return response.status(500).json({
      error: {
        message: error.message,
      },
    })
  }
}

export default onRoute
