#! /bin/bash

cd events

mkdir -p ./db/store/test
touch ./db/store/test/events.db
NODE_ENV=test ../node_modules/.bin/sequelize db:migrate

mkdir -p ./db/store/development
touch ./db/store/development/events.db
NODE_ENV=development ../node_modules/.bin/sequelize db:migrate
