FROM node:18
WORKDIR /backend
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY ./ ./
EXPOSE 1080
EXPOSE 1443
CMD npm run deploy