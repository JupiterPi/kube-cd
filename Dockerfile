FROM node:18-alpine
WORKDIR /app
COPY . .
# RUN npm ci && npm run build && rm -rf node_modules && npm install --production
RUN npm ci && npm run build
EXPOSE 80
CMD ["npm", "start"]