#!/usr/bin/env bash

echo "--- Starting 01_uninstall_cement.sh ---"
VENV_PATH=$(find /var/app/venv/ -maxdepth 1 -type d -name "staging-*" -print -quit)

if [ -d "$VENV_PATH" ]; then
  echo "Found virtual environment path: $VENV_PATH"
  echo "Attempting to uninstall 'cement' package from this environment..."
  "$VENV_PATH/bin/pip" uninstall cement -y || true
else
  echo "Virtual environment directory not found. Skipping 'cement' uninstall."
fi
echo "--- Finished 01_uninstall_cement.sh ---"