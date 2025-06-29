# Stage 1: Install node modules
FROM node:lts as npm-install

WORKDIR /app
COPY ./package*.json /app/
RUN npm install

# Stage 2: Build Project
FROM node:lts as build

WORKDIR /app
COPY --from=npm-install /app/node_modules /app/node_modules
COPY ./ /app/
RUN echo $(ls src/assets/config)
RUN echo $(cat src/assets/config/version.txt)


RUN npm run ng build --no-progress --configuration=production

# Stage 3: Serve app with nginx
FROM nginx:1.29.0-alpine

RUN apk update && apk add jq esh

COPY --from=build /app/dist/edc-demo-client /usr/share/nginx/html
COPY --from=build /app/src/assets /usr/share/nginx/html/assets
RUN echo $(ls usr/share/nginx/html/assets/config)
RUN echo $(cat usr/share/nginx/html/assets/config/version.txt)

COPY docker/default.conf.esh etc/nginx/conf.d/default.conf.esh

ENV NGINX_BIND=""
ENV NGINX_PORT=80

HEALTHCHECK --interval=2s --timeout=5s --retries=10 \
  CMD curl -f http://${NGINX_BIND:"localhost"}:$NGINX_PORT/ || exit 1

# Before starting nginx, apply ENV vars:
# (1) Apply NGINX_BIND and NGINX_PORT to nginx.conf
# (2) Create app-config.json from EDC_UI_* ENV Vars
CMD esh -o /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.esh \
 && jq -n 'env | with_entries( select(.key | startswith("EDC_UI_") ) )' > /usr/share/nginx/html/assets/config/app-config.json \
 && nginx -g "daemon off;"

