#!/bin/bash

echo "========== Predeploy Hook Starting =========="
echo "Current user: $(whoami)"
echo "PATH: $PATH"

# Print Python version
echo "Checking Python version..."
python3 --version

# Check if python3 is available
if ! command -v python3 &> /dev/null
then
    echo "Error: python3 not found in PATH"
    exit 1
fi

# Navigate to backend directory if needed
cd backend || {
    echo "Error: Cannot change directory to backend"
    exit 1
}

# Run Django system checks
echo "Running Django manage.py check..."
python3 manage.py check

echo "========== Predeploy Hook Finished =========="
