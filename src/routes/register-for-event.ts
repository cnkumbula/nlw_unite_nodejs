import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_error/bad_request";


export async function registerForEvent(app: FastifyInstance) {

  app
  .withTypeProvider<ZodTypeProvider>()
  .post('/events/:eventId/attendees', {

    schema: {
      summary: 'Register an attendee for an event',
      tags: ['Attendees'],
      body: z.object({
        name: z.string().min(4),
        email: z.string().email(),
      }),

      params: z.object({
        eventId: z.string().uuid(),
      }),
      response: {
        201: z.object({
          attendeeId: z.number(),
        })
      }
    }
    
  },async (request, reply) => {
    const { eventId } = request.params
    const { name, email } = request.body

    const attendeeFromEmail = await prisma.attendee.findUnique({
      where: {
        eventId_email: {
          email,
          eventId
        }
      }
    })

    if (attendeeFromEmail !== null) {
      throw new BadRequest(`The email address: ${email} has already been registered for this event`)
    }

   /* const participants = await prisma.attendee.count({
      where: {
        eventId
      }
    })

    const event = await prisma.event.findUnique({
      where: {
        id: eventId
      }
    })*/

    const [participants, event] = await Promise.all([
      prisma.attendee.count({
        where: {
          eventId
        }
      }),
      prisma.event.findUnique({
        where: {
          id: eventId
        }
      })
    ])


    if (event?.maximumAttendees && participants == event.maximumAttendees) {
      
        throw new BadRequest('Sorry, the maximum number of participants has been reached.')
      }
      
    
    const attendee = await prisma.attendee.create({
      data: {
        name,
        email,
        eventId
      }
    })

    return reply.status(201).send({ attendeeId: attendee.id})

    })
}
