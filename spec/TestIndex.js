'use strict';

const path    = require('path');
const chai    = require('chai');
const sinon   = require('sinon');
const Logger  = require(path.join(__dirname, '..', 'index'))
const expect  = chai.expect;

describe('Logger', () => {
  let sandbox;

  beforeEach( () => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(console, "log");
    sandbox.stub(console, "error");
  });

  afterEach( () => {
    sandbox.restore()
  });

  describe('#new(string)', () => {
    it('Default Logger.', () =>
      expect(new Logger('Default'))
        .to.have.all.keys('child','setLevel','timer','trace','debug','log','info','warn','error')
    );
    it('Configured Logger.', () =>
      expect(new Logger({name:'Configed',level:'trace'}))
        .to.have.all.keys('child','setLevel','timer','trace','debug','log','info','warn','error')
    );
  });

  describe('#createTimer(string)', () => {
    const logger = new Logger({name:'Timing',level:'trace'});
    it('Default, no output', () => {
      const timer = logger.timer('first');
      const timer2 = logger.timer('second');
      sinon.assert.notCalled(console.log);
    });
    it('Default, output', () => {
      const timer = logger.timer('first');
      logger.info(timer);
      sinon.assert.calledOnce(console.log);
    });
  });

  describe('#child(string)', () => it('Get Child', () => new expect(Logger({name:'Timing',level:'trace'}).child('first')).to.not.equal(null)) )

  describe('#setLevel(string)', () => {
    it('change to trace', () => {
      let logger = new Logger({name:'Timing',level:'info'})
      logger.setLevel('trace')
      logger.trace('test');
      logger.debug('test');
      logger.log('test');
      logger.info('test');
      logger.warn('test');
      logger.error('test');
      sinon.assert.callCount(console.log,5);
      sinon.assert.callCount(console.error,1);
    });
    it('change to info', () => {
      let logger = new Logger({name:'Timing',level:'trace'})
      logger.setLevel('info')
      logger.trace('test');
      logger.debug('test');
      logger.log('test');
      logger.info('test');
      logger.warn('test');
      logger.error('test');
      sinon.assert.callCount(console.log,3);
      sinon.assert.callCount(console.error,1);
    });
    it('change to error', () => {
      let logger = new Logger({name:'Timing',level:'trace'})
      logger.setLevel('error')
      logger.trace('test');
      logger.debug('test');
      logger.log('test');
      logger.info('test');
      logger.warn('test');
      logger.error('test');
      sinon.assert.notCalled(console.log);
      sinon.assert.callCount(console.error,1);
    });
  });
});