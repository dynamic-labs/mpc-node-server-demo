FROM --platform=linux/amd64 docker.io/library/node:20-bookworm-slim as builder
COPY --from=public.ecr.aws/datadog/serverless-init@sha256:90fc905284982ea18f92a45030fc4c6620a5206d2e5a2bd26262f1064339f323 /datadog-init /datadog-init
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./.npmrc /app/.npmrc
WORKDIR /app
ARG NPM_SODOT_TOKEN
RUN npm ci
COPY . /app
RUN npm run clean
RUN npm run build 
RUN npm install --omit=dev
FROM --platform=linux/amd64 docker.io/library/node:20-bookworm-slim AS lastlayer
COPY --from=builder /datadog-init /datadog-init
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json /app
RUN apt-get update && apt-get install -y \
    file \
    ca-certificates \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*
#  Environment is a build arg and also exposed to the container and cannot be changed without rebuilding the image
ARG ENVIRONMENT
ENV ENVIRONMENT=${ENVIRONMENT}
ENV DD_SOURCE=enclave
ENV DD_SERVICE=embedded-wallet-enclave
ENV DD_ENV=${ENVIRONMENT}
ENV DD_LOGS_ENABLED=true
ENV NODE_ENV=production
COPY --from=builder /app/datadog.yaml /var/task/datadog.yaml
RUN file /datadog-init
USER root
RUN mkdir -p /opt/evervault
ADD https://enclave-build-assets.evervault.com/installer/173cb7030ebc30708c6c98266d15dba12f0265d3e7da3f66bb7cc5c3c4dbf94f.tar.gz /opt/evervault/runtime-dependencies.tar.gz
RUN cd /opt/evervault ; tar -xzf runtime-dependencies.tar.gz ; sh ./installer.sh ; rm runtime-dependencies.tar.gz
RUN echo {\"api_key_auth\":true,\"egress\":{\"allow_list\":\"*.datadoghq.com,relay.dynamic-preprod.xyz,app.dynamic-preprod.xyz,*.herokuapp.com\"},\"forward_proxy_protocol\":false,\"healthcheck\":\"/api/v1/actions/HealthCheck\",\"trusted_headers\":[],\"trx_logging_enabled\":true} > /etc/dataplane-config.json
RUN mkdir -p /etc/service/user-entrypoint
RUN printf "#!/bin/sh\nsleep 5\necho \"Checking status of data-plane\"\nSVDIR=/etc/service sv check data-plane || exit 1\necho \"Data-plane up and running\"\nwhile ! grep -q \"EV_INITIALIZED\" /etc/customer-env\n do echo \"Env not ready, sleeping user process for one second\"\n sleep 1\n done \n . /etc/customer-env\n\necho \"Booting user service...\"\ncd %s\nexec /datadog-init node /app/dist/src/index.js\n" "$PWD"  > /etc/service/user-entrypoint/run && chmod +x /etc/service/user-entrypoint/run
ADD https://enclave-build-assets.evervault.com/runtime/1.2.1/data-plane/egress-enabled/tls-termination-enabled /opt/evervault/data-plane
RUN chmod +x /opt/evervault/data-plane
RUN mkdir -p /etc/service/data-plane
RUN printf "#!/bin/sh\necho \"Booting Evervault data plane...\"\nexec /opt/evervault/data-plane 8008\n" > /etc/service/data-plane/run && chmod +x /etc/service/data-plane/run
RUN printf "#!/bin/sh\nifconfig lo 127.0.0.1\n echo \"enclave.local\" > /etc/hostname \n echo \"127.0.0.1 enclave.local\" >> /etc/hosts \n hostname -F /etc/hostname \niptables -A OUTPUT -t nat -p tcp --dport 1:65535 ! -d 127.0.0.1  -j DNAT --to-destination 127.0.0.1:4444\nip route add default via 127.0.0.1 dev lo\niptables -t nat -A POSTROUTING -o lo -s 0.0.0.0 -j SNAT --to-source 127.0.0.1\necho \"Booting enclave...\"\nexec runsvdir /etc/service\n" > /bootstrap && chmod +x /bootstrap
ENTRYPOINT ["/bootstrap", "1>&2"]
