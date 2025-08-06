#!/bin/bash

echo "Post-deploy hook running..."

# Try both current and staging, so it works during testing or deployment
cd /var/app/current || cd /var/app/staging || {
  echo "Failed to change directory to /var/app/current or /var/app/staging"
  exit 1
}

# Activate virtual environment
source /var/app/venv/*/bin/activate || {
  echo "Failed to activate virtual environment"
  exit 1
}

# Start Gunicorn
/var/app/venv/*/bin/gunicorn --chdir backend backend.backend.wsgi:application --bind 127.0.0.1:8000 &

echo "Post-deploy hook finished!"
