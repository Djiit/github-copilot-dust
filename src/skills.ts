import { Router } from "express";
import { verifyRequest } from "@copilot-extensions/preview-sdk";

import { askDust } from "./dust.js";
import { config } from "./config.js";

export const router = Router();

if (!config.disableRequestVerification) {
  router.use(async (req, res, next) => {
    const signature = String(req.headers["github-public-key-signature"]);
    const keyID = String(req.headers["github-public-key-identifier"]);
    try {
      const payloadIsVerified = await verifyRequest(req.body, signature, keyID);
      if (!payloadIsVerified) {
        res.status(401).send("Unauthorized");
        return;
      }
    } catch (error) {
      req.log.error(error);
      res.status(400).send("Bad Request");
      return;
    }
    next();
  });
}

router.post("/ping", async (req, res) => {
  res.send("pong");
});

router.post("/dust", async (req, res) => {
  const { message, assistant } = req.body;
  const answer = await askDust(message, assistant);
  res.send(answer);
});
