FROM node:18
WORKDIR /backend
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
EXPOSE 8080
ENV NODE_ENV=docker
RUN npm install
CMD npm start