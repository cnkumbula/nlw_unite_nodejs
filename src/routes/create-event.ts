import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { generateSlug } from "../utils/generate-slug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { BadRequest } from "./_error/bad_request"


export async function createEvent(app: FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>()
  .post('/events', {
    schema: {
      summary: 'Create an event',
      tags: ['Events'],
      body: z.object({
        title: z.string({invalid_type_error: 'The title must be a string', required_error: 'The title is required', description: 'The title of the event' }).min(4, { message: 'The title must be at least 4 characters long' }),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),
      }),
      response: {
        201: z.object({
          eventId: z.string().uuid(),
        })
      }
    }

  }, async (request, reply) => {
    const {
      title,
      details,
      maximumAttendees
    } = request.body

    const slug = generateSlug(title)

    const slugAlreadyExists = await prisma.event.findUnique({
      where: {
        slug
      }
    })

    if (slugAlreadyExists !== null) {
      //return reply.status(409).send({ message: 'Slug already exists' })
      throw new BadRequest('Slug already exists')
    }

    const event = await prisma.event.create({
      data: {
        //...data
        title,
        details,
        maximumAttendees,
        slug
      },
    })

    return  reply.status(201).send({ eventId: event.id })

  })

  }
