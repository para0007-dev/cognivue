#!/usr/bin/env node

/**
 * Auto Port Manager
 * Features: Detect port usage and automatically select available ports to start servers
 */

import net from 'net';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  frontend: {
    defaultPort: 5001,
    portRange: [5001, 5002, 5003, 5004, 5005],
    command: 'npm',
    args: ['run', 'dev'],
    cwd: path.dirname(__dirname)
  },
  backend: {
    defaultPorts: [8000, 8001, 8002],
    portRange: [8000, 8001, 8002, 8003, 8004, 8005],
    command: 'python',
    args: ['manage.py', 'runserver'],
    cwd: path.join(path.dirname(__dirname), 'backend', 'cognivue'),
    env: { DJANGO_DEV: '1' }
  }
};

/**
 * Check if port is occupied
 */
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, '127.0.0.1', () => {
      server.once('close', () => {
        resolve(false); // Port available
      });
      server.close();
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true); // Port occupied
      } else {
        resolve(false); // Other error, assume available
      }
    });
  });
}

/**
 * Find available port
 */
async function findAvailablePort(portRange) {
  for (const port of portRange) {
    const isOccupied = await checkPort(port);
    if (!isOccupied) {
      return port;
    }
  }
  return null;
}

/**
 * Get all port status
 */
async function getPortStatus() {
  const status = {
    frontend: {},
    backend: {}
  };

  // Check frontend ports
  for (const port of CONFIG.frontend.portRange) {
    status.frontend[port] = await checkPort(port);
  }

  // Check backend ports
  for (const port of CONFIG.backend.portRange) {
    status.backend[port] = await checkPort(port);
  }

  return status;
}

/**
 * Start frontend server
 */
async function startFrontend(port = null) {
  const availablePort = port || await findAvailablePort(CONFIG.frontend.portRange);
  
  if (!availablePort) {
    console.error('[ERROR] No available frontend ports');
    return null;
  }

  console.log(`[INFO] Starting frontend server on port ${availablePort}`);
  
  const args = [...CONFIG.frontend.args, '--', '--port', availablePort];

  const childProcess = spawn(CONFIG.frontend.command, args, {
    cwd: CONFIG.frontend.cwd,
    stdio: 'inherit',
    shell: true
  });

  return { port: availablePort, process: childProcess };
}

/**
 * Start backend server
 */
async function startBackend(port = null) {
  const availablePort = port || await findAvailablePort(CONFIG.backend.portRange);
  
  if (!availablePort) {
    console.error('[ERROR] No available backend ports');
    return null;
  }

  console.log(`[INFO] Starting backend server on port ${availablePort}`);
  
  const args = [...CONFIG.backend.args, availablePort];
  
  const childProcess = spawn(CONFIG.backend.command, args, {
    cwd: CONFIG.backend.cwd,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...CONFIG.backend.env }
  });

  return { port: availablePort, process: childProcess };
}

/**
 * Update .env file with API base URL
 */
function updateEnvFile(backendPort) {
  const envPath = path.join(path.dirname(__dirname), '.env');
  const newApiBase = `VITE_API_BASE=http://127.0.0.1:${backendPort}`;
  
  try {
    if (fs.existsSync(envPath)) {
      let content = fs.readFileSync(envPath, 'utf8');
      if (content.includes('VITE_API_BASE=')) {
        content = content.replace(/VITE_API_BASE=.*/, newApiBase);
      } else {
        content += `\n${newApiBase}`;
      }
      fs.writeFileSync(envPath, content);
    } else {
      fs.writeFileSync(envPath, newApiBase);
    }
    console.log(`[SUCCESS] Updated .env file: ${newApiBase}`);
  } catch (error) {
    console.error('[ERROR] Failed to update .env file:', error.message);
  }
}

/**
 * Update vite.config.js proxy configuration
 */
function updateViteConfig(backendPort) {
  const viteConfigPath = path.join(path.dirname(__dirname), 'vite.config.js');
  
  try {
    if (fs.existsSync(viteConfigPath)) {
      let content = fs.readFileSync(viteConfigPath, 'utf8');
      const newTarget = `'http://127.0.0.1:${backendPort}'`;
      
      // Update all proxy targets
      content = content.replace(
        /target:\s*'http:\/\/127\.0\.0\.1:\d+'/g,
        `target: ${newTarget}`
      );
      
      fs.writeFileSync(viteConfigPath, content);
      console.log(`[SUCCESS] Updated vite.config.js proxy to port ${backendPort}`);
    }
  } catch (error) {
    console.error('[ERROR] Failed to update vite.config.js:', error.message);
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'status':
      console.log('[INFO] Checking port status...');
      const status = await getPortStatus();
      console.log('\nFrontend port status:');
      Object.entries(status.frontend).forEach(([port, occupied]) => {
        console.log(`  ${port}: ${occupied ? 'OCCUPIED' : 'AVAILABLE'}`);
      });
      console.log('\nBackend port status:');
      Object.entries(status.backend).forEach(([port, occupied]) => {
        console.log(`  ${port}: ${occupied ? 'OCCUPIED' : 'AVAILABLE'}`);
      });
      break;

    case 'frontend':
      const frontendPort = args[1] ? parseInt(args[1]) : null;
      await startFrontend(frontendPort);
      break;

    case 'backend':
      const backendPort = args[1] ? parseInt(args[1]) : null;
      const result = await startBackend(backendPort);
      if (result) {
        updateEnvFile(result.port);
        updateViteConfig(result.port);
      }
      break;

    case 'auto':
      console.log('[INFO] Auto start mode...');
      
      // Start backend
      const backendResult = await startBackend();
      if (backendResult) {
        updateEnvFile(backendResult.port);
        updateViteConfig(backendResult.port);
        
        // Wait for backend to start
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Start frontend
        await startFrontend();
      }
      break;

    default:
      console.log(`
Auto Port Manager

Usage:
  node auto-port-manager.js status              - Check port status
  node auto-port-manager.js frontend [port]     - Start frontend server
  node auto-port-manager.js backend [port]      - Start backend server
  node auto-port-manager.js auto                - Auto start both servers

Examples:
  node auto-port-manager.js status
  node auto-port-manager.js frontend 5174
  node auto-port-manager.js backend 8003
  node auto-port-manager.js auto
      `);
  }
}

// Handle process exit
process.on('SIGINT', () => {
  console.log('\n[INFO] Shutting down servers...');
  process.exit(0);
});

// Check if this module is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  checkPort,
  findAvailablePort,
  getPortStatus,
  startFrontend,
  startBackend,
  updateEnvFile,
  updateViteConfig
};