#!/bin/bash
echo "Starting predeploy hook"
python --version
which python
python manage.py check
