# Nautilus
Modern issue tracker.

## Getting Started Using Docker

1. Initialize and start the containers:

  ```
  docker-compose create
  docker-compose run --rm api config set db.address mongodb://db:27017/nautilus
  docker-compose run --rm api update
  docker-compose run --rm web server config set api.address http://localhost:3000
  docker-compose up
  ```

2. Open your web browser and point to:

  ```
  http://localhost:3100
  ```

3. Log in:

  ```
  Username: admin
  Password: changeme
  ```
