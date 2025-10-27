const fs = require('fs');
const path = require('path');
// Load .env into process.env if present (for local dev)
try { require('dotenv').config(); } catch (e) { /* ignore if dotenv not installed */ }

const targetPath = path.resolve(__dirname, 'src/assets/env.js');
const targetDir = path.dirname(targetPath);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Prefer real environment variables (CI/CD), fall back to values from .env loaded into process.env, then to localhost defaults
const AUTH_API_URL = process.env.AUTH_API_URL || 'http://localhost:8080/auth';
const HR_API_URL = process.env.HR_API_URL || 'http://localhost:8081/api';
const IT_API_URL = process.env.IT_API_URL || 'http://localhost:8082/api';

const fileContent = `(function(window) {
  window.env = window.env || {};
  window.env.AUTH_API_URL = ${JSON.stringify(AUTH_API_URL)};
  window.env.HR_API_URL = ${JSON.stringify(HR_API_URL)};
  window.env.IT_API_URL = ${JSON.stringify(IT_API_URL)};
})(this);`;

fs.writeFileSync(targetPath, fileContent, { encoding: 'utf8' });

console.log(`Generated env.js at ${targetPath}`);
console.log(`AUTH_API_URL: ${AUTH_API_URL}`);
console.log(`HR_API_URL: ${HR_API_URL}`);
console.log(`IT_API_URL: ${IT_API_URL}`);