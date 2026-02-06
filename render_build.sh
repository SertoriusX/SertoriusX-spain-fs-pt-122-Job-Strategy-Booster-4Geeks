#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm install axios

npm run build

pipenv install --dev --deploy --ignore-pipfile
psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE;"
psql "$DATABASE_URL" -c "CREATE SCHEMA public;"

pipenv run flask db stamp head
pipenv install google-generativeai
pipenv install openai
pipenv run migrate
pipenv run upgrade
