FROM node:22.9.0-slim

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install --save-dev @types/jsonwebtoken

COPY start-with-delay.sh /usr/local/bin/start-with-delay.sh
RUN chmod +x /usr/local/bin/start-with-delay.sh

COPY . .

EXPOSE 3000

CMD ["start-with-delay.sh"]