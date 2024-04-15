import fastify from "fastify";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";

import { serializerCompiler, validatorCompiler, jsonSchemaTransform, ZodTypeProvider } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIns } from "./routes/check_ins";
import { getEventAttendees } from "./routes/get-event-attendees";
import { errorHandler } from "./error-hancler";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "PassIn",
      description: "PassIn API",
      version: "1.0.0"
    },
  },
  transform: jsonSchemaTransform,
})


app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIns)
app.register(getEventAttendees)

app.setErrorHandler(errorHandler)


app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running on http://localhost:3333")
})