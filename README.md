# Newspaper

## Running backend and frontend without Docker compose 
We still need docker container for mysql. 

backend: </br>
npm install </br>
npm deploy (or npm start for development)

client:
npm install </br>
npm start
 
Ports: </br>
Frontend: 3000 </br>
Backend: http:1080 (redirects to https); https:1443 

## Running with Docker compose
cd to the root folder. </br>
docker-compose build </br>
docker-compose up
