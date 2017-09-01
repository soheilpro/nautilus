FROM node:8.4

WORKDIR /usr/app/src
COPY ./src/package.json ./src/package-lock.json /usr/app/src/
RUN npm install

WORKDIR /usr/app
COPY . /usr/app/
RUN ./run.sh build

ENTRYPOINT ["/usr/app/run.sh"]
CMD ["start"]
