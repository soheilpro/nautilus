FROM node:8.4

WORKDIR /usr/app/src/client
COPY ./src/client/package.json ./src/client/package-lock.json /usr/app/src/client/
RUN npm install

WORKDIR /usr/app/src/server
COPY ./src/server/package.json ./src/server/package-lock.json /usr/app/src/server/
RUN npm install

WORKDIR /usr/app
COPY . /usr/app/
RUN ./run.sh client release && \
    ./run.sh server build

ENTRYPOINT ["/usr/app/run.sh"]
CMD ["server", "start"]
