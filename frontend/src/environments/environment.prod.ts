export const environment = {
  production: true,
  authApiUrl: window.env?.AUTH_API_URL ?? 'https://security-service.up.railway.app/auth',
  hrApiUrl: window.env?.HR_API_URL ?? 'https://hr-service.up.railway.app/api',
  itApiUrl: window.env?.IT_API_URL ?? 'https://it-service.up.railway.app/api'
};