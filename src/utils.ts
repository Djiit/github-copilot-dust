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

export const DUST_AGENT: AgentType = {
  sId: "dust",
  name: "Dust",
  description: "An assistant with context on your company data.",
};

export const USER_NAME = "GitHub Copilot";
export const DUST_API_URL = "https://dust.tt/";
export const DUST_NODE_ENV = "";

export const DUST_CONTEXT: ConversationContext = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  username: USER_NAME,
  email: null,
  fullName: USER_NAME,
  profilePictureUrl:
    "https://dust.tt/static/systemavatar/helper_avatar_full.png",
  origin: "github-copilot-chat",
};
