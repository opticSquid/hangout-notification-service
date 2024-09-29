FROM node:lts-alpine3.20
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5012
CMD ["npm", "run", "start:prod"]