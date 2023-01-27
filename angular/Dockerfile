FROM node:latest as build

ARG ANG_APP_SERVICES_HOST=/api/v1

RUN mkdir /project

WORKDIR /project

RUN npm install -g @angular/cli@latest

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["ng", "serve", "--host", "0.0.0.0"]

EXPOSE 4200
