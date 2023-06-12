FROM node:18
WORKDIR /backend

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY ./ ./

CMD npm run deploy