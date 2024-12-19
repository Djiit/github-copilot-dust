import "dotenv/config";
import express from "express";
import { DustAPI, type AgentActionPublicType } from "@dust-tt/client";
import { config } from "dotenv";
import { pinoHttp, type Options } from "pino-http";
import helmet from "helmet";

import { DUST_CONTEXT, DUST_AGENT, DUST_API_URL } from "./utils.js";

config({ path: ".env.local", override: true });

const app = express();

const pinoOptions: Options = { level: process.env.LOG_LEVEL || "info" };

if (process.env.NODE_ENV !== "production") {
  pinoOptions.transport = {
    target: "pino-pretty",
  };
}

const pino = pinoHttp(pinoOptions);
app.use(pino);
app.use(helmet());

app.get("/health", (req, res) => {
  res.send("OK");
});

app.post("/ping", (req, res) => {
  res.send("pong");
});

app.post("/dust", async (req, res) => {
  const abortController = new AbortController();
  const dustApi = new DustAPI(
    {
      url: DUST_API_URL,
    },
    {
      workspaceId: process.env.DUST_WORKSPACE_ID || "",
      apiKey: process.env.DUST_API_KEY || "",
    },
    req.log,
  );

  const r = await dustApi.createConversation({
    title: null,
    visibility: "unlisted",
    message: {
      content: "What is the answer to life, the universe, and everything?",
      mentions: [
        {
          configurationId: DUST_AGENT.sId,
        },
      ],
      context: DUST_CONTEXT,
    },
  });

  if (r.isErr()) {
    const error = r.error.message;
    res.send(`**Dust API error** ${error}`);
  } else {
    const { conversation, message } = r.value;
    if (!conversation || !message) {
      res.send("**Dust API error** (conversation or message is missing)");
    } else {
      try {
        const r = await dustApi.streamAgentAnswerEvents({
          conversation,
          userMessageId: message.sId,
          signal: abortController.signal,
        });
        if (r.isErr()) {
          throw new Error(r.error.message);
        } else {
          const { eventStream } = r.value;

          for await (const event of eventStream) {
            if (!event) {
              continue;
            }
            switch (event.type) {
              case "user_message_error": {
                req.log.error(
                  `User message error: code: ${event.error.code} message: ${event.error.message}`,
                );
                res.send(`**User message error** ${event.error.message}`);
                return;
              }
              case "agent_error": {
                req.log.error(
                  `Agent message error: code: ${event.error.code} message: ${event.error.message}`,
                );
                res.send(`**Dust API error** ${event.error.message}`);
                return;
              }

              case "agent_message_success": {
                res.send(event.message.content);
                return;
              }
              default:
              // Nothing to do on unsupported events
            }
          }
        }
      } catch (error) {
        res.send(`**Dust API error** ${error}`);
      }
    }
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  pino.logger.info(`Server listening on port ${port}`);
});
