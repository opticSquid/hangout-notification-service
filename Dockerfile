FROM node:20-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5012
CMD ["npm", "run", "start:prod"]