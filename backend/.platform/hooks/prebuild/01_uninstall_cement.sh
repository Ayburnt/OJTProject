#!/usr/bin/env bash

# This script runs during the prebuild stage of Elastic Beanstalk deployment.
# Its purpose is to attempt to uninstall a potentially conflicting version of
# the 'cement' package before the application's requirements.txt is processed.

echo "--- Starting 01_uninstall_cement.sh ---"

# Elastic Beanstalk typically activates a virtual environment.
# We need to find its path, which might vary slightly depending on the platform version.
# Look for a directory starting with "staging-" inside /var/app/venv/
VENV_PATH=$(find /var/app/venv/ -maxdepth 1 -type d -name "staging-*" -print -quit)

if [ -d "$VENV_PATH" ]; then
  echo "Found virtual environment path: $VENV_PATH"
  echo "Attempting to uninstall 'cement' package from this environment..."

  # Attempt to uninstall cement.
  # The '-y' flag confirms the uninstall without prompting.
  # '|| true' ensures the script doesn't fail the deployment if cement isn't found
  # or if there's an issue with the uninstall command itself.
  "$VENV_PATH/bin/pip" uninstall cement -y || true

  # You can add a check here to see if it was successful, though pip's exit code usually suffices
  # if ! "$VENV_PATH/bin/pip" show cement > /dev/null 2>&1; then
  #   echo "'cement' successfully uninstalled (or was not present)."
  # else
  #   echo "Warning: 'cement' might still be present after uninstall attempt."
  # fi

else
  echo "Virtual environment directory not found at /var/app/venv/. Skipping 'cement' uninstall."
  echo "This might happen if the virtual environment is set up differently or later in the process."
fi

echo "--- Finished 01_uninstall_cement.sh ---"