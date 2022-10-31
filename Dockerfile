FROM node:lts-alpine
ENV NODE_ENV=development
RUN apk update && apk upgrade
RUN apk add sqlite
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --development --silent && mv node_modules ../
COPY . .
RUN npm test
EXPOSE 5051
CMD ["npm", "start"]