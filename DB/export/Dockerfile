FROM node:10-alpine
EXPOSE 3000

WORKDIR /usr/src/app
COPY export/package*.json ./
RUN npm install
COPY export .
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
RUN chmod +x /wait

CMD ["npm", "start"]
