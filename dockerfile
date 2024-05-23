FROM node:18.17
RUN npm install --global pnpm
WORKDIR /monkey-pictures-app
COPY package.json ./  
COPY pnpm-lock.yaml ./  
RUN pnpm i
COPY . .
RUN npm run build
EXPOSE 3000
CMD npm run generate && npm run migrate && npm run db-seed && npm run start
