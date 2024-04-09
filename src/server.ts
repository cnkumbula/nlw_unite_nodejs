import fastify from "fastify";

import fastifySwagger from "@fastify/swagger";

import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIns } from "./routes/check_ins";
import { getEventAttendees } from "./routes/get-event-attendees";
import fastifySwaggerUi from "@fastify/swagger-ui";

const app = fastify();

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


app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running on http://localhost:3333")
})