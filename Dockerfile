FROM node:10

RUN npm install -g yarn

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install
# 소스 추가
COPY . .

# ENV DB_HOST
# ENV REDIS_HOST

# 포트 매핑
EXPOSE 8000
# 실행 명령
CMD ["yarn", "run", "start"]