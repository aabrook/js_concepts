#! /bin/bash

mkdir -p ./events/db/store/test
touch ./events/db/store/test/events.db
cd events
NODE_ENV=test ../node_modules/.bin/sequelize db:migrate

