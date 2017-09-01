#!/usr/bin/env sh

NAUTILUS_DB_CONFIG=${NAUTILUS_DB_CONFIG:-./config/mongodb.sh}
NAUTILUS_DB_MONGODB_PORT=${NAUTILUS_DB_MONGODB_PORT:-'27017'}
NAUTILUS_DB_MONGODB_DBPATH=${NAUTILUS_DB_MONGODB_DBPATH:-'./data'}
NAUTILUS_DB_MONGODB_DBNAME=${NAUTILUS_DB_MONGODB_DBNAME:-'nautilus'}

if [ -f "$NAUTILUS_DB_CONFIG" ]; then
  source $NAUTILUS_DB_CONFIG
fi

COMMAND=$1

shift

case "$COMMAND" in
  mongod)
    mongod --port $NAUTILUS_DB_MONGODB_PORT --dbpath $NAUTILUS_DB_MONGODB_DBPATH "$@"
    ;;

  mongo)
    mongo --port $NAUTILUS_DB_MONGODB_PORT $NAUTILUS_DB_MONGODB_DBNAME "$@"
    ;;

  mongodump)
    mongodump --port $NAUTILUS_DB_MONGODB_PORT --db $NAUTILUS_DB_MONGODB_DBNAME "$@"
    ;;

  mongorestore)
    mongorestore --port $NAUTILUS_DB_MONGODB_PORT --db $NAUTILUS_DB_MONGODB_DBNAME "$@"
    ;;

  *)
    echo "Usage:"
    echo "  $(basename "$0") mongod"
    echo "  $(basename "$0") mongo"
    echo "  $(basename "$0") mongodump"
    echo "  $(basename "$0") mongorestore"
    exit 1
esac
