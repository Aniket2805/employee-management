export {};

declare global {
  interface Window {
    env?: {
      AUTH_API_URL?: string;
      HR_API_URL?: string;
      IT_API_URL?: string;
      [key: string]: string | undefined;
    };
  }
}
