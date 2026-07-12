const getTimestamp = (): string => {
  return new Date().toISOString();
};

export const logger = {
  info: (message: string, ...meta: unknown[]): void => {
    console.log(`[${getTimestamp()}] ℹ️ [INFO]: ${message}`, ...meta);
  },
  warn: (message: string, ...meta: unknown[]): void => {
    console.warn(`[${getTimestamp()}] ⚠️ [WARN]: ${message}`, ...meta);
  },
  error: (message: string, ...meta: unknown[]): void => {
    console.error(`[${getTimestamp()}] ❌ [ERROR]: ${message}`, ...meta);
  },
  debug: (message: string, ...meta: unknown[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${getTimestamp()}] 🔍 [DEBUG]: ${message}`, ...meta);
    }
  },
};

export default logger;
