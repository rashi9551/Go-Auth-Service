FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

Run npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
