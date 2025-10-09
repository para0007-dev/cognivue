#!/bin/bash

# BrainViD Project Startup Script
echo "Starting BrainViD project..."

# Check virtual environment
if [ ! -d "../venv" ]; then
    echo "Virtual environment not found, please create it first"
    echo "Run: python -m venv ../venv"
    exit 1
fi

# Activate virtual environment
echo "Activating Python virtual environment..."
source ../venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r backend/cognivue/requirements.txt

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Database migration
echo "Running database migrations..."
cd backend/cognivue
ADMIN_PASS=sinepgib python manage.py migrate
cd ../..

echo "Project setup completed!"
echo ""
echo "Startup instructions:"
echo "1. Start backend: cd backend/cognivue && ADMIN_PASS=sinepgib python manage.py runserver"
echo ""
echo "Note: Make sure you're in the cognivue directory when running the backend command"
echo "2. Start frontend: npm run dev"
echo "3. Visit: http://localhost:5173"
echo "4. Login password: sinepgib"
echo ""
echo "Or use VS Code: Ctrl+Shift+P -> 'Tasks: Run Task' to run predefined tasks"