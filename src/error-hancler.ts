import { FastifyInstance} from "fastify";
import { BadRequest } from "./routes/_error/bad_request";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance['errorHandler']


export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  //const { validation, validationContext } = error

  if(error instanceof ZodError) {
    return reply.status(400).send({
      /*message: `Error validation request ${validationContext}`,
      errors: validation*/
      message: 'Error during validation',
      //errors: error.format()
      errors: error.flatten()
    })
  }

  if(error instanceof BadRequest) {
    return reply.status(400).send({
      message: error.message
    })
  }
  return reply.status(500).send({
    message: 'Internal Server error'
  })
}