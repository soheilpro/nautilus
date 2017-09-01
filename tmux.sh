#!/usr/bin/env sh

SESSION=nautilus
BASEDIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

tmux new-session -d -s $SESSION

# main
tmux new-window -c "$BASEDIR" -n root

# db
tmux new-window -c "$BASEDIR/projects/db" -n db
tmux split-window -c "$BASEDIR/projects/db" -t $SESSION:db -v
tmux send-keys -t $SESSION:db.1 "./run.sh start" C-m

# api
tmux new-window -c "$BASEDIR/projects/api" -n api
tmux split-window -c "$BASEDIR/projects/api/src" -t $SESSION:api.1 -v
tmux send-keys -t $SESSION:api.1 "export DEBUG=nautilus-api" C-m
tmux send-keys -t $SESSION:api.1 "./run.sh watch" C-m

# web-client
tmux new-window -c "$BASEDIR/projects/web" -n web-client
tmux split-window -c "$BASEDIR/projects/web/src/client" -t $SESSION:web-client.1 -v
tmux send-keys -t $SESSION:web-client.1 "./run.sh client watch" C-m

# web-server
tmux new-window -c "$BASEDIR/projects/web" -n web-server
tmux split-window -c "$BASEDIR/projects/web/src/server" -t $SESSION:web-server.1 -v
tmux send-keys -t $SESSION:web-server.1 "export DEBUG=nautilus-web" C-m
tmux send-keys -t $SESSION:web-server.1 "./run.sh server watch" C-m

tmux kill-window -t $SESSION:1
tmux select-window -t $SESSION:root
tmux attach-session -t $SESSION
