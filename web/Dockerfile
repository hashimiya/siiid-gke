FROM node:12.13.0
WORKDIR /app
ADD . .
RUN yarn install && yarn build
CMD ["yarn", "start"]
EXPOSE 65431
