#!/usr/bin/env bash
set -o errexit

npm install
npm run build

# Instead of pipenv, just use pip and python directly
pip install -r requirements.txt

psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE;"
psql "$DATABASE_URL" -c "CREATE SCHEMA public;"

# Run flask migrations using python -m flask
python -m flask db stamp head
python -m flask db migrate
python -m flask db upgrade
