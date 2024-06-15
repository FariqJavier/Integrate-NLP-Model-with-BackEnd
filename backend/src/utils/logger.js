const signale = require('signale');

const log = {
  debug: (message) => signale.debug(message),
  info: (message) => signale.info(message),
  warn: (message) => signale.warn(message),
  error: (message) => signale.error(message),
  // Add additional methods for custom log levels if needed
};

// Optional: Customize formatting
signale.config({
  displayLevel: true, // Show the log level
  displayTimestamp: true,  // Show timestamp
  // Other formatting options: https://github.com/klaussinani/signale#styling
});

module.exports = log;