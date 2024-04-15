import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequest } from "./_error/bad_request";

export async function getEvent(app: FastifyInstance) {

  app
  .withTypeProvider<ZodTypeProvider>()
  .get('/events/:eventId', {
    schema: {
      summary: 'Get an event',
      tags: ['Events'],
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        200: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().nullable(),
              participants: z.number().int()
            }) 
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params
    const event = await prisma.event.findUnique({
      select: {
        id: true,
        title: true,
        slug: true,
        details: true,
        maximumAttendees: true,
        _count: {
          select: {
            attendees: true
          }
        }
      },

      where: {
        id: eventId
      }
    })

    if (event === null) {
      throw new BadRequest('Event not found')
    }
    return reply.status(200).send({ 
      event: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        details: event.details,
        maximumAttendees: event.maximumAttendees,
        participants: event._count.attendees
      } 
    })
  })
  
}