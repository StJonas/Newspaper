FROM node:18
WORKDIR /client
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY ./ ./
EXPOSE 3000
CMD npm start