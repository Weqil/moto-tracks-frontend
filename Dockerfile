FROM node:22-alpine3.19 as build

WORKDIR /var/www/MLCity_frontend

COPY . .

RUN npm install
RUN export NODE_OPTIONS="--max-old-space-size=8192"
RUN npm run build


FROM nginx:latest

COPY --from=build  /var/www/MLCity_frontend/www/browser /usr/share/nginx/html
COPY docker/nginx/ /etc/nginx/conf.d/