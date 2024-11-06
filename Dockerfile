FROM node:20
COPY . /app
WORKDIR /app/server
RUN npm install
RUN npm run build
EXPOSE 3000
CMD [ "bash", "-c", "npm run start" ]
