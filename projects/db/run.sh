#!/usr/bin/env sh

BASEDIR="$(pwd)"
COMMAND=$1

case "$COMMAND" in
  config)
    "${EDITOR:-vi}" ${NAUTILUS_DB_CONFIG:-./config/mongodb.sh}
    ;;

  start)
    $BASEDIR/mongodb.sh mongod
    ;;

  mongo)
    $BASEDIR/mongodb.sh mongo
    ;;

  backup)
    $BASEDIR/mongodb.sh mongodump --archive --gzip
    ;;

  restore)
    $BASEDIR/mongodb.sh mongo --eval 'db.dropDatabase()'
    $BASEDIR/mongodb.sh mongorestore --archive --gzip
    ;;

  *)
    echo "Usage:"
    echo "  $(basename "$0") config"
    echo "  $(basename "$0") start"
    echo "  $(basename "$0") mongo"
    echo "  $(basename "$0") backup"
    echo "  $(basename "$0") restore"
    exit 1
esac
