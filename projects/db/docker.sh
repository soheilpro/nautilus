#!/usr/bin/env sh

NAUTILUS_DB_DOCKER_IMAGE_TAG=${NAUTILUS_DB_DOCKER_IMAGE_TAG:-'nautilus/db'}
NAUTILUS_DB_DOCKER_CONTAINER_NAME=${NAUTILUS_DB_DOCKER_CONTAINER_NAME:-'nautilus-db'}
COMMAND=$1

case "$COMMAND" in
  build)
    docker build --tag $NAUTILUS_DB_DOCKER_IMAGE_TAG .
    ;;

  start)
    RUNNING=$(docker inspect $NAUTILUS_DB_DOCKER_CONTAINER_NAME 2> /dev/null)

    if [ $? -eq 1 ]; then
      docker run --name $NAUTILUS_DB_DOCKER_CONTAINER_NAME --volume nautilus-db-config:/usr/app/config --volume nautilus-db-data:/usr/app/data --detach $NAUTILUS_DB_DOCKER_IMAGE_TAG:latest
    else
      docker start $NAUTILUS_DB_DOCKER_CONTAINER_NAME
    fi
    ;;

  stop)
    docker stop $NAUTILUS_DB_DOCKER_CONTAINER_NAME
    ;;

  restart)
    docker restart $NAUTILUS_DB_DOCKER_CONTAINER_NAME
    ;;

  rm)
    docker rm $NAUTILUS_DB_DOCKER_CONTAINER_NAME
    ;;

  logs)
    docker logs $NAUTILUS_DB_DOCKER_CONTAINER_NAME
    ;;

  shell)
    docker exec --interactive --tty $NAUTILUS_DB_DOCKER_CONTAINER_NAME '/bin/bash'
    ;;

  run)
    shift 1

    if [ "$1" == '--no-tty' ]; then
      shift 1
    else
      NAUTILUS_DB_DOCKER_RUN_TTY='--tty'
    fi

    docker exec --interactive $NAUTILUS_DB_DOCKER_RUN_TTY $NAUTILUS_DB_DOCKER_CONTAINER_NAME './run.sh' "$@"
    ;;

  *)
    echo "Usage:"
    echo "  $(basename "$0") build"
    echo "  $(basename "$0") start"
    echo "  $(basename "$0") stop"
    echo "  $(basename "$0") restart"
    echo "  $(basename "$0") rm"
    echo "  $(basename "$0") logs"
    echo "  $(basename "$0") shell"
    echo "  $(basename "$0") run [--no-tty] <cmd>"
    exit 1
esac
