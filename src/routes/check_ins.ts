import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Schema, z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_error/bad_request";

export async function checkIns(app: FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>()
  .get('/attendees/:attendeeId/check-in', {
    schema: {
      summary: 'Chaeck in an attendee for an event.',
      tags: ['Checkins'],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        201: z.null(),
      }
    }
  }, async(request, reply) => {
    const { attendeeId } = request.params

    const attendeeCheckIn = await prisma.checkIn.findUnique({
      where: {
        attendeeId,
      }
    })

    const attendeeCheckIn_email = await prisma.attendee.findUnique({
      select: {
        email: true
      },
      where: {
        id: attendeeId,
      }
    })

    if (attendeeCheckIn !== null) {
     // throw new Error('Already checked in')
     throw new BadRequest(`the attendee ${attendeeCheckIn_email?.email} is Already checked in`)
    }

    await prisma.checkIn.create({
      data: {
        attendeeId
      }
    })

    return reply.status(201).send()
  }



  
  )}
