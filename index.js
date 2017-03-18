'use strict';

module.exports = function(_config) {

  /* istanbul ignore next */
  const util = require( 'util' );
  /* istanbul ignore next */
  const config = {
    level : 'info',
    name : 'default'
  };

  /* istanbul ignore next */
  Object.assign(config, typeof _config === 'string' ? {'name':_config} : _config );

  /* istanbul ignore next */
  const levelValues = { 'trace': 2, 'debug': 4, 'info': 5, 'warn': 6, 'error': 8 };
  /* istanbul ignore next */
  const isLevel = level => levelValues[config.level] <= levelValues[level];
  /* istanbul ignore next */
  const duckTestTimer = toTest => typeof toTest === 'object' && toTest.timer && toTest.name && toTest.timestamp;
  /* istanbul ignore next */
  const toMilliseconds = nanoseconds => nanoseconds / 1000 / 1000;
  const instance = {

    logIf: (level,message,object) => { if(isLevel(level)) instance.log(level,message,object) },
    log: (level,message,object) => {
      if(duckTestTimer(message)){
        const duration = process.hrtime(message.timestamp);
        message = `${message.name} took ${toMilliseconds(duration[0] * 1e9 + duration[1])}ms`;
      }
      console[levelValues[level] > 6 ? 'error' : 'log'](instance.formatLine(level,message), object ? object : '');
    },

    formatLine: (level,message) => {
      /*
       * If this value is set then the code is running in lambda and we don't not need
       * a timestamp.
       */
      if(process.env.AWS_REGION && process.env.AWS_LAMBDA_FUNCTION_NAME){
        return `\t[${level}] ${config.name}\t${message}`;
      } else {
        return `${new Date().toISOString()} [${level}]\t${config.name}\t${message}`;
      }
    },

    /*
     * Creates a child logger from the current logger.
     */
    child: (childConfig) => {
      return new module.exports({
        name: config.name + '.' + (typeof childConfig === 'string' ? childConfig : childConfig.name),
        level: childConfig.level || config.level
      });
    },

    createTimer: (name) => {
      return {
        timer: true,
        name: name ? name : 'default',
        timestamp: process.hrtime()
      }
    }
  }

  return {
    setLevel: level => config.level = level,
    child: instance.child,
    timer: instance.createTimer,
    trace: (message,object) => instance.logIf('trace',message,object),
    debug: (message,object) => instance.logIf('debug',message,object),
    log: (message,object) => instance.logIf('info',message,object),
    info: (message,object) => instance.logIf('info',message,object),
    warn: (message,object) => instance.logIf('warn',message,object),
    error: (message,object) => instance.logIf('error',message,object)
  }
}