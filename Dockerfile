FROM node:9

# Default port - change using env var
ENV PORT 8899

# Default Cache TTL in ms - change using env var
ENV CACHE_TTL 900000

EXPOSE 8899

RUN mkdir /app
WORKDIR /app

COPY *.json /app/

RUN npm i

COPY *.js /app/

CMD [ "node", "server.js" ]
