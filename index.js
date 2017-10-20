'use strict';

class Logger {
  constructor(_config){
    /* istanbul ignore next */
    this.config = {
      level : 'info',
      name : 'default'
    };

    /* istanbul ignore next */
    Object.assign(this.config, typeof _config === 'string' ? {'name':_config} : _config );

    /* istanbul ignore next */
    const levelValues = { 'trace': 2, 'debug': 4, 'info': 5, 'warn': 6, 'error': 8 };
    /* istanbul ignore next */
    const isLevel = level => levelValues[this.config.level] <= levelValues[level];
    /* istanbul ignore next */
    const duckTestTimer = toTest => typeof toTest === 'object' && toTest.timer && toTest.name && toTest.timestamp;
    /* istanbul ignore next */
    const toMilliseconds = nanoseconds => nanoseconds / 1000 / 1000;

    this._logIf = (level,message,object) => isLevel(level) ? this._log(level,message,object) : null;
    
    this._log = (level,message,object) => {
      if(duckTestTimer(message)){
        const duration = process.hrtime(message.timestamp);
        message = `${message.name} took ${toMilliseconds(duration[0] * 1e9 + duration[1])}ms`;
      }
      console[levelValues[level] > 6 ? 'error' : 'log'](this._formatLine(level,message), object ? object : '');
    };

    this._formatLine = (level,message) => {
      /*
      * If this value is set then the code is running in lambda and we don't not need
      * a timestamp.
      */
      if(process.env.AWS_REGION && process.env.AWS_LAMBDA_FUNCTION_NAME){
        return `\t[${level}] ${this.config.name}\t${message}`;
      } else {
        return `${new Date().toISOString()} [${level}]\t${this.config.name}\t${message}`;
      }
    };
  }

  setLevel(level){
    this.config.level = level;
  }

  child(_config) {
    return new Logger({
      name: this.config.name + '.' + (typeof _config === 'string' ? _config : _config.name),
      level: _config && _config.level ? _config.level : this.config.level
    });
  }
 
  timer(name) {
    return {
      timer: true,
      name: name ? name : 'default',
      timestamp: process.hrtime()
    }
  }

  trace(message,object){
    return this._logIf('trace',message,object);
  }

  debug(message,object)  {
    return this._logIf('debug',message,object);
  }

  log(message,object) {
    return this._logIf('info',message,object);
  }

  info(message,object){ 
    return this._logIf('info',message,object);
  }

  warn(message,object){
    return this._logIf('warn',message,object);
  }

  error(message,object){
    return this._logIf('error',message,object);
  }
}

module.exports = Logger;