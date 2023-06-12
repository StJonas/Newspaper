FROM node:18-alpine as frontend-node
WORKDIR /frontend

COPY package.json ./
COPY package-lock.json ./
COPY nginx/ ./

RUN npm install

COPY . ./
RUN npm run build

RUN apk add dos2unix
RUN dos2unix ./*
RUN dos2unix ./*/*

FROM nginx:1.24.0-alpine

COPY nginx/nginx.conf  /etc/nginx/conf.d/default.conf
COPY --from=frontend-node --chown=nginx:nginx  /frontend/build  /usr/share/nginx/html
COPY --from=frontend-node --chown=nginx:nginx  /frontend/certificate/certificate.pem  /etc/nginx/certificate.pem
COPY --from=frontend-node --chown=nginx:nginx  /frontend/certificate/key.pem  /etc/nginx/key.pem

RUN apk add dos2unix
RUN dos2unix /usr/share/nginx/html
RUN dos2unix /etc/nginx/certificate.pem
RUN dos2unix /etc/nginx/key.pem

CMD ["nginx", "-g", "daemon off;"]