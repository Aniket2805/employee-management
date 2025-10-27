export const environment = {
  production: false,
  authApiUrl: window.env?.AUTH_API_URL ?? 'http://localhost:8080/auth',
  hrApiUrl: window.env?.HR_API_URL ?? 'http://localhost:8081/api',
  itApiUrl: window.env?.IT_API_URL ?? 'http://localhost:8082/api'
};