FROM node:alpine

ARG WORKDIR=/app

WORKDIR $WORKDIR
COPY . $WORKDIR
RUN npm ci --only=production

CMD ["node", "bot.js"]
