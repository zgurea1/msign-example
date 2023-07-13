export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: string | number;
      LOG_FORMAT: string;
      LOG_DIR: string;
      ORIGIN: string;
      CREDENTIALS: boolean;
      WSDL_URL: string;
      MSING_API: string;
      FRONTEND_URL: string;
    }
  }
}
