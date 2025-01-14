FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV HUSKY=0
COPY package.json pnpm-lock.yaml /app/
RUN corepack enable
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
COPY . /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
ENV NODE_ENV="production"

RUN apk add --no-cache curl
HEALTHCHECK CMD curl http://localhost:3000/health || exit 1

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ARG PORT=3000
ENV PORT=${PORT}
ARG METRICS_PORT=9464
ENV METRICS_PORT=${METRICS_PORT}

EXPOSE ${PORT} ${METRICS_PORT}

CMD [ "pnpm", "start" ]