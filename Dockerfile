# syntax=docker/dockerfile:1

FROM --platform=linux/amd64 docker.io/library/node:20-bookworm-slim as builder
COPY --from=public.ecr.aws/datadog/serverless-init@sha256:90fc905284982ea18f92a45030fc4c6620a5206d2e5a2bd26262f1064339f323 /datadog-init /datadog-init
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./.npmrc /app/.npmrc

WORKDIR /app

# Make npm more verbose and ensure it fails on error
RUN --mount=type=secret,id=NPM_TOKEN,env=NPM_TOKEN npm ci --verbose || exit 1

COPY . /app
RUN npm run clean
RUN npm run build 
RUN npm install --omit=dev


FROM --platform=linux/amd64 docker.io/library/node:20-bookworm-slim
COPY --from=builder /datadog-init /datadog-init
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json /app

RUN apt-get update && apt-get install -y \
    file \
    ca-certificates \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

# Environment is a build arg and also exposed to the container and cannot be changed without rebuilding the image
ARG ENVIRONMENT
ENV ENVIRONMENT=${ENVIRONMENT}

ENV DD_SOURCE=enclave
ENV DD_SERVICE=wallet-service
ENV DD_ENV=${ENVIRONMENT}
ENV DD_LOGS_ENABLED=true
ENV NODE_ENV=production

COPY --from=builder /app/datadog.yaml /var/task/datadog.yaml

RUN file /datadog-init

EXPOSE 8008
ENTRYPOINT [ "/datadog-init" ]
CMD ["node", "/app/dist/src/index.js"]