const { createLogger, transports, format } = require('winston')

const logger = createLogger({
  transports: [
    new transports.Console({
      handleExceptions: true
    })
  ],
  exitOnError: false,
  format: format.combine(
    format.colorize(),
    format.cli()
  )
})

const morganOption = {
  stream: {
    write: (message) => {
      logger.info(message)
    }
  }
}

module.exports = { logger, morganOption }
