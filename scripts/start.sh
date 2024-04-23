#!/usr/bin/env sh

bundle install

rm -f tmp/pids/server.pid

bin/rails db:prepare db:migrate
bin/rails server -b 0.0.0.0 -p 3000
