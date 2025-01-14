import { DustAPI, type AgentActionPublicType } from "@dust-tt/client";

import { config } from "./config.js";
import { logger } from "./logger.js";

type ConversationContext = {
  timezone: string;
  username: string;
  email: string | null;
  fullName: string;
  profilePictureUrl: string | null;
  origin: "github-copilot-chat";
};

export interface AgentType {
  sId: string;
  name: string;
  description: string;
}

export const DUST_DEFAULT_AGENT: AgentType = {
  sId: "dust",
  name: "Dust",
  description: "An assistant with context on your company data.",
};

export const USER_NAME = "GitHub Copilot";
export const DUST_API_URL = "https://dust.tt/";

export const DUST_CONTEXT: ConversationContext = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  username: USER_NAME,
  email: null,
  fullName: USER_NAME,
  profilePictureUrl:
    "https://dust.tt/static/systemavatar/helper_avatar_full.png",
  origin: "github-copilot-chat",
};

const dustApi = new DustAPI(
  {
    url: DUST_API_URL,
  },
  config.dust,
  logger.logger,
);

const getAgent = async (name: string): Promise<AgentType> => {
  if (name === DUST_DEFAULT_AGENT.name) {
    return DUST_DEFAULT_AGENT;
  }

  const r = await dustApi.getAgentConfigurations({});
  if (r.isErr()) {
    throw new Error(r.error.message);
  }

  const agent = r.value.find(
    (a: AgentType) => a.name.toLowerCase() === name.toLowerCase(),
  );
  return agent ?? DUST_DEFAULT_AGENT;
};

export const askDust = async (question: string, assistant?: string) => {
  const agent = await getAgent(assistant || DUST_DEFAULT_AGENT.name);
  const r = await dustApi.createConversation({
    title: null,
    visibility: "unlisted",
    message: {
      content: question,
      mentions: [
        {
          configurationId: agent.sId,
        },
      ],
      context: DUST_CONTEXT,
    },
  });

  if (r.isErr()) {
    const error = r.error.message;
    return `**Dust API error** ${error}`;
  }

  const { conversation, message } = r.value;
  if (!conversation || !message) {
    return "**Dust API error** (conversation or message is missing)";
  }
  try {
    const r = await dustApi.streamAgentAnswerEvents({
      conversation,
      userMessageId: message.sId,
    });
    if (r.isErr()) {
      throw new Error(r.error.message);
    }
    const { eventStream } = r.value;

    for await (const event of eventStream) {
      if (!event) {
        continue;
      }
      switch (event.type) {
        case "user_message_error": {
          logger.logger.error(
            `User message error: code: ${event.error.code} message: ${event.error.message}`,
          );
          return `**User message error** ${event.error.message}`;
        }
        case "agent_error": {
          logger.logger.error(
            `Agent message error: code: ${event.error.code} message: ${event.error.message}`,
          );
          return `**Dust API error** ${event.error.message}`;
        }

        case "agent_message_success": {
          return event.message.content;
        }
        default:
        // Nothing to do on unsupported events
      }
    }
  } catch (error) {
    return `**Dust API error** ${error}`;
  }
};
