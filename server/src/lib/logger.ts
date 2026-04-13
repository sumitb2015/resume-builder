import dotenv from 'dotenv';
dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatLog(level: LogLevel, message: string, context?: any) {
  const timestamp = new Date().toISOString();
  
  if (isDev) {
    const color = {
      info: '\x1b[32m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
      debug: '\x1b[34m',
    }[level];
    const reset = '\x1b[0m';
    
    let ctxString = '';
    if (context) {
      if (context instanceof Error) {
        ctxString = `\n${context.stack}`;
      } else {
        ctxString = ` ${JSON.stringify(context, null, 2)}`;
      }
    }
    
    return `${color}[${level.toUpperCase()}]${reset} ${timestamp}: ${message}${ctxString}`;
  }

  return JSON.stringify({
    level,
    timestamp,
    message,
    ...(context instanceof Error ? { error: context.message, stack: context.stack } : context),
  });
}

export const logger = {
  info: (msg: string, ctx?: any) => console.log(formatLog('info', msg, ctx)),
  warn: (msg: string, ctx?: any) => console.warn(formatLog('warn', msg, ctx)),
  error: (msg: string, ctx?: any) => console.error(formatLog('error', msg, ctx)),
  debug: (msg: string, ctx?: any) => isDev && console.log(formatLog('debug', msg, ctx)),
};
