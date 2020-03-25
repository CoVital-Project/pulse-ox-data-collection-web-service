import winston from 'winston';

import { format } from 'winston';

const { combine, timestamp, label, simple } = format;

const nullLog = {
  silent: () => {},

  add: () => {},
  remove: () => {},
  clear: () => {},
  close: () => {},

  error: () => {},
  warn: () => {},
  help: () => {},
  data: () => {},
  info: () => {},
  debug: () => {},
  prompt: () => {},
  http: () => {},
  verbose: () => {},
  input: () => {},
  silly: () => {},

  // for syslog levels only
  emerg: () => {},
  alert: () => {},
  crit: () => {},
  warning: () => {},
  notice: () => {}
};

const consoleTransport = logLabel =>
  new winston.transports.Console({
    format: combine(simple(), label({ label: logLabel }), timestamp()),
    timestamp: true
  });
export const devlog = true
  ? winston.createLogger({
      level: 'debug',
      transports: [consoleTransport('DEV')]
    })
  : nullLog;

export const mainlog = true
  ? winston.createLogger({
      level: 'debug',
      format: winston.format.json(),
      transports: [
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.

        new winston.transports.File({
          filename: '/var/log/po/error.log',
          level: 'error'
        }),
        new winston.transports.File({ filename: '/var/log/po/combined.log' }),
        consoleTransport('MAIN')
      ]
    })
  : nullLog;

mainlog.stream = {
  write: function(message) {
    mainlog.info(message);
  }
};

if (process.env.NODE_ENV === 'production') {
  devlog.remove(consoleTransport('DEV'));
}

module.exports.devlog = devlog;
module.exports.mainlog = mainlog;
