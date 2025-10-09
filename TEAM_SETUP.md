# Team Collaboration Setup Guide

## Frontend and Backend Connection Configuration

### 1. Environment Variables Setup

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### 2. Modify Backend Connection Configuration

If your backend service runs on a different address or port, please modify the `.env` file:

#### Scenario 1: If backend runs on a different port
```env
VITE_DEV_BACKEND_PORT=8080
```

#### Scenario 2: If backend runs on a different host
```env
VITE_DEV_BACKEND_HOST=192.168.1.100
VITE_DEV_BACKEND_PORT=8000
```

### 3. Common Configuration Scenarios

#### Scenario A: Backend running on different machine
```env
VITE_DEV_BACKEND_HOST=192.168.1.100
VITE_DEV_BACKEND_PORT=8000
```

#### Scenario B: Using Docker
```env
VITE_DEV_BACKEND_HOST=localhost
VITE_DEV_BACKEND_PORT=8080
```

### 4. API Interface List

The following API endpoints are available:
- `/nutrition/` - Nutrition analysis and recommendations
- `/auth/` - User authentication
- `/api/` - General API endpoints

### 5. Troubleshooting

#### Connection Refused Error
- Check if backend server is running
- Verify the host and port configuration
- Ensure firewall allows the connection

#### CORS Errors
- Backend must be configured to allow frontend origin
- Check Django CORS settings

#### 404 Errors
- Verify API endpoint URLs
- Check backend routing configuration

### 6. Development Recommendations

1. Keep API interfaces consistent between team members
2. Use environment variables for all configuration
3. Document any API changes
4. Test connections after configuration changes

### 7. Quick API Testing

Test if backend is accessible:
```bash
curl http://127.0.0.1:8000/nutrition/
```

Replace the host and port with your actual backend configuration.

### 8. Restart Frontend Service

After modifying the `.env` file, restart the frontend development server:

```bash
npm run dev
```

The changes will take effect immediately.