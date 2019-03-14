# lamlog
Simple logging solution for Node.js AWS Lambda projects. Focus on brevity, ie a tiny code footprint.

# 3.0 
1. Annotations for convenient tracing.
1. More access to the powerful features of console https://nodejs.org/api/console.html#console_console_assert_value_message
1. Less realiance on template strings to print out complex log statements.
1. TypeScript first implementation.

# Usage

## Child
Gets a child logger that will contain the parent history for each logging statement of that child. This allows you to track the specific path of execution that resulted in the logging statement.

## Timer
To measure the amount of time elapsed between to points, first call ```const myTimer = logger.timer('nameOfTimer)``` then when you are ready to print out the time to console simply pass the timer as an argument to any of the logging methods such as debug ```logger.debug('My Timer',myTimer)```.

## Levels
This has a progressive level of logging that allows you to change the verbosity of your application depending on the current runtime needs. For exmaple, you set your logging level to 'error' nothing below that point will be reported to the console.

Each logging statement matches console.log, in that you can pass in a message and an object. In fact, under the covers, it is only using console.log or console.error, just with a bit of formatting help and stops to help with verbosity.

1. trace() - Intimate application behavior for a specific module.
2. debug() - Detailed 'general' application behavior.
3. info() - Configuration information.
4. log() - Synonym for info, to be consistent with console.
5. warn() - Problematic behavior that isn't application fatal.
6. error() - Broken or failed behavior.

```|JavaScript
const Logger = require('lamlog');
const logger = new Logger({name:'Parent',level:'trace'});

/*
 * Changes the logging level.
 */
logger.setLevel('warn');

logger.trace(`My message ${variable} value.`);
logger.trace('My message',variable);

logger.debug(`My message ${variable} value.`);
logger.debug('My message',variable);

logger.info(`My message ${variable} value.`);
logger.info('My message',variable);

logger.log(`My message ${variable} value.`);
logger.log('My message',variable);

logger.warn(`My message ${variable} value.`);
logger.warn('My message',variable);

logger.error(`My message ${variable} value.`);
logger.error('My message',variable);
```

## Timer
Allows for easy reporting on the duration of execution of code. Each timing is a point in time, so it can be safely passed into paralelle or promise chains to be referenced at multiple points in time. 

```|JavaScript
const Logger = require('lamlog');
const logger = new Logger({name:'Parent',level:'trace'});

function SuperSpecial(_logger) {
  /*
   * Will take on the logging level of its parent logger, and each logging
   *  statement will reflect the object chain.
   */
  const logger = _logger.child({name:'SuperSpecial'});
  
  /*
   * Records the current time, so it can be reported in a logging statement later.
   */
  const timing = logger.timer('NameOfTimer');
  
  /*
   * A timer can be reported directly in a logging statment and 
   *  reported appropriately.
   */
  logger.info(timing);
  //2017-03-18T07:47:03.512Z [info]	Parent.SuperSpecial	NameOfTimer took 0.195009ms
}
```

```|TypeScript
import * as Config from 'lamcfg';
const logger = new Logger({name:'Parent',level:'trace'});

class SuperSpecial {

  constructor(_logger){
    this.logger = _logger.child("SuperSpecial");
  }

  superSpecial():void {
      
    /*
    * Records the current time, so it can be reported in a logging statement later.
    */
    const timing = logger.timer('NameOfTimer');
    
    /*
    * A timer can be reported directly in a logging statment and 
    *  reported appropriately.
    */
    logger.info(timing);
    //2017-03-18T07:47:03.512Z [info]	Parent.SuperSpecial	NameOfTimer took 0.195009ms
  }
}
```