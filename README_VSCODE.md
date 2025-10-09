# BrainViD - VS Code Setup Guide

This is a full-stack project with Vue.js frontend and Django backend.

## System Requirements

- **Node.js**: >= 20.19 (Latest LTS recommended)
- **Python**: >= 3.9
- **VS Code**: Latest version

## Quick Start

### Method 1: Using VS Code Workspace (Recommended)

1. **Open Project**
   ```bash
   # Open workspace file in VS Code
   code BrainViD.code-workspace
   ```

2. **Install Recommended Extensions**
   - VS Code will prompt to install recommended extensions
   - Or manually install: Python, Pylance, Vue Language Features (Volar)

3. **Set Python Interpreter**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Search "Python: Select Interpreter"
   - Select `../venv/bin/python`

4. **Run Setup Task**
   - Press `Ctrl+Shift+P` and search "Tasks: Run Task"
   - Select "Setup Project" to install all dependencies

5. **Launch Project**
   - Press `F5` or use debug panel
   - Select "Launch Full Stack" to start both frontend and backend

### Method 2: Using Terminal Commands

1. **Prepare Environment**
   ```bash
   # Make sure you're in project root
   cd /Users/yingyingren/Desktop/BrainViD/cognivue
   
   # Run setup script
   ./start_project.sh
   ```

2. **Manual Startup**
   ```bash
   # Terminal 1: Start backend
   cd backend/cognivue
   source ../../venv/bin/activate
   ADMIN_PASS=sinepgib python manage.py runserver
   
   # Terminal 2: Start frontend
   npm run dev
   ```

## VS Code Configuration Details

### Debug Configuration

Project includes pre-configured debug settings:

- **Django Backend**: Debug Django backend server
- **Vue Frontend**: Debug Vue frontend application
- **Launch Full Stack**: Start both frontend and backend

### Task Configuration

Available VS Code tasks:

- **Install Python Dependencies**: Install Python packages
- **Install Node Dependencies**: Install Node.js packages
- **Django Migrate**: Run database migrations
- **Start Django Backend**: Start Django backend
- **Start Vue Frontend**: Start Vue frontend
- **Setup Project**: Complete project setup

### Using Tasks

1. Press `Ctrl+Shift+P`
2. Search "Tasks: Run Task"
3. Select the task to run

## Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Login Password**: `sinepgib`

## Project Structure

```
cognivue/
|-- src/                    # Vue.js frontend source
|   |-- views/             # Page components
|   |-- components/        # Reusable components
|   |-- router/           # Router configuration
|   |-- services/         # API services
|-- backend/              # Django backend
|   |-- cognivue/        # Django project
|-- BrainViD.code-workspace  # VS Code workspace config
|-- .env                 # Environment variables
|-- start_project.sh     # Startup script
```

## Development Workflow

### 1. Daily Development

1. Open VS Code workspace: `code BrainViD.code-workspace`
2. Press `F5` to start debug mode
3. Visit http://localhost:5173 in browser
4. Modify code, hot reload will work automatically

### 2. Debug Backend

1. Set breakpoints in Django code
2. Use "Django Backend" debug configuration
3. Send API requests to trigger breakpoints

### 3. Debug Frontend

1. Set breakpoints in Vue components
2. Use browser developer tools
3. Or use VS Code JavaScript debugging

## Common Issues

### Q: Virtual environment not found?
A: Make sure there's a `venv` folder in parent directory, or run:
```bash
cd /Users/yingyingren/Desktop/BrainViD
python -m venv venv
```

### Q: Backend startup fails?
A: Check if environment variable is set:
```bash
export ADMIN_PASS=sinepgib
```

### Q: Frontend can't connect to backend?
A: Ensure:
1. Backend is running on http://localhost:8000
2. VITE_API_BASE in .env file is correct

### Q: Login fails?
A: Make sure to use correct password: `sinepgib`

## Environment Variables

Project uses these environment variables (in `.env` file):

```env
# Backend authentication password
ADMIN_PASS=sinepgib

# Frontend API base URL
VITE_API_BASE=http://127.0.0.1:8000

# Django debug mode
DEBUG=True
```

## Next Steps

1. Familiarize yourself with project structure
2. Explore Vue components
3. Understand Django API endpoints
4. Start your development work!

---

**Tip**: Use VS Code integrated terminal for easier multi-service management. Press `Ctrl+`` to open terminal panel.