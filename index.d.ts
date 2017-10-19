declare module "lamlog" {
  
  class Timer {
    name:string;
    timestamp:any;
  }

  class Settings {
    /**
     * Name of this logger.
     */
    name:string;
    /**
     * The log level, and above, messages to display.
     */
    level:string;
  }

  class Logger{
    constructor(settings?:Settings | string);
    
    /**
     * Creates a child logger from the parent. Helpful when you have a 
     *  dependency and want to maintain a logging relationship to the parent.
     * @param name 
     */
    child(name:Settings | string):Logger;

    /**
     * Locates the configuration in the environment.
     * 
     * @param name 
     * @param inlineDefault 
     */
    setLevel(level:string):any;

    /**
     * Creates a timer with the given name.
     * 
     * @param defaults 
     */
    timer(name:string):Timer;

    /**
     * Trace level messages will only show if trace level logging is enabled.
     * 
     * @param message To send to the console.
     * @param object provide context to the message.
     */
    trace(message:string,object:any):void;
    
    /**
     * Debug level messages show if debug or lower (trace) level logging is set.
     * 
     * @param message To send to the console.
     * @param object provide context to the message.
     */
    debug(message:string,object:any):void;
    
    /**
     * Info level messages show if info or lower (trace) level logging is set.
     * 
     * @param message To send to the console.
     * @param object provide context to the message.
     */
    info(message:string,object:any):void;
    
    /**
     * Log level messages show if info or lower (trace) level logging is set.
     * 
     * @param message To send to the console.
     * @param object provide context to the message.
     */
    log(message:string,object:any):void;
    
    /**
     * Warn level messages show if info or lower (trace) level logging is set.
     * 
     * @param message To send to the console.
     * @param object provide context to the message.
     */
    warn(message:string,object:any):void;
    
    /**
     * Error level messages show if info or lower (trace) level logging is set.
     * 
     * @param message To send to the console.
     * @param object provide context to the message.
     */
    error(message:string,object:any):void;
  }
}