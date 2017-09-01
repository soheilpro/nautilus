#!/usr/bin/env sh

BASEDIR="$(pwd)"
COMMAND=$1

case "$COMMAND" in
  build)
    (cd $BASEDIR/src && npm run --silent build)
    ;;

  clean)
    (cd $BASEDIR/src && npm run --silent clean)
    ;;

  config)
    shift 1
    (cd $BASEDIR/src && npm run --silent config "$@")
    ;;

  install)
    (cd $BASEDIR/src && npm install)
    ;;

  start)
    (cd $BASEDIR/src && npm run --silent start)
    ;;

  test)
    (cd $BASEDIR/src && npm run --silent test)
    ;;

  update)
    (cd $BASEDIR/src && npm run --silent update)
    ;;

  watch)
    (cd $BASEDIR/src && npm run --silent watch)
    ;;

  *)
    echo "Usage:"
    echo "  $(basename "$0") build"
    echo "  $(basename "$0") clean"
    echo "  $(basename "$0") config"
    echo "  $(basename "$0") install"
    echo "  $(basename "$0") start"
    echo "  $(basename "$0") test"
    echo "  $(basename "$0") update"
    echo "  $(basename "$0") watch"
    exit 1
esac
