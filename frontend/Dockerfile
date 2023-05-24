FROM node:18-alpine as build
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

FROM nginx:stable-alpine
COPY nginx/default.conf  /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx  /frontend/build  /usr/share/nginx/html
COPY --from=build --chown=nginx:nginx  /frontend/.cert/certificate.pem  /etc/nginx/certificate.pem
COPY --from=build --chown=nginx:nginx  /frontend/.cert/key.pem  /etc/nginx/key.pem
EXPOSE 80
EXPOSE 443

RUN apk add dos2unix
RUN dos2unix /usr/share/nginx/html
RUN dos2unix /etc/nginx/certificate.pem
RUN dos2unix /etc/nginx/key.pem

CMD ["nginx", "-g", "daemon off;"]
