FROM node:22.9.0-slim

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install --save-dev @types/jsonwebtoken

COPY start-with-delay.sh /usr/local/bin/start-with-delay.sh

RUN apt-get update && apt-get install -y dos2unix && dos2unix /usr/local/bin/start-with-delay.sh && chmod +x /usr/local/bin/start-with-delay.sh

COPY . .

EXPOSE 3000

CMD ["/bin/sh", "usr/local/bin/start-with-delay.sh"]