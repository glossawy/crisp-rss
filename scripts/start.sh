#!/usr/bin/env sh

bundle install

rm -f tmp/pids/server.pid

bin/rails db:prepare db:migrate

if [ "z${CRISPRSS_MODE}" == "zqueue" ]; then
  bundle exec good_job start
else
  bin/rails server -b 0.0.0.0 -p 3000
fi
