FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g nodemon
RUN yarn install

COPY ./index.js ./index.js 
COPY ./config/ ./config/
COPY ./services/ ./services/

# ENV DB_HOST
# ENV REDIS_HOST


EXPOSE 8000

CMD ["yarn", "run", "start"]