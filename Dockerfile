FROM node:18-alpine
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]
