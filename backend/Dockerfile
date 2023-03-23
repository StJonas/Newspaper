FROM node:16
WORKDIR /backend
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
EXPOSE 8080
RUN npm install
CMD npm start