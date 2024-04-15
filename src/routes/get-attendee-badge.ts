import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_error/bad_request";

export async function getAttendeeBadge(app:FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>()
  .get('/attendees/:attendeeId/badge', {

    schema: {
      summary: 'Get an attendee badge',
      tags: ['Attendees'],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        200: z.object({
          badge: z.object({
            id: z.number(),
            name: z.string(),
            email: z.string().email(),
            eventTitle: z.string(),
            checkInURL: z.string().url()
          })
        })
      }
    }

  }, async (request, reply) => {
    const { attendeeId } = request.params

    const attendee = await prisma.attendee.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        event:{
          select: {
            title: true
          }
        }

      },
      where: {
        id: attendeeId
      }
    })

    if (attendee === null) {
      throw new BadRequest('Attendee not found')
    }

    const baseURL = `${request.protocol}://${request.hostname}`

    //console.log(baseURL)
    const checkInURL = new URL(`/attendees/${attendee.id}/check-in`, baseURL)

    return reply.status(200).send({ 
      badge:{
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        eventTitle: attendee.event.title,
        checkInURL: checkInURL.toString()
      }

    })
    
  })
  
}