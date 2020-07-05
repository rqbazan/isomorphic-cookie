/* eslint-env jasmine */
const expect = require('expect');
const cookie = require('cookie');

const _serialize = cookie.serialize;

const encoding = require('../src/encoding');
const save = require('../src/save');

const _encode = encoding.encode;

describe('save()', () => {
  beforeEach(() => {
    // mock decode and cookie
    encoding.encode = expect.createSpy().andCall((string) => string);
    cookie.serialize = expect.createSpy();
  });

  afterEach(() => {
    encoding.encode = _encode;
    cookie.serialize = _serialize;
  });

  it('should save to cookies in browser', () => {
    // mock the browser
    global.document = {
      cookie: '',
    };

    save.default('testName', 'testVal');

    expect(cookie.serialize)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('testName', 'testVal', save.defaultBrowserOpts);

    expect(encoding.encode)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('testVal');

    global.document = undefined;
  });

  it('should add to response header on server', () => {
    const resExpress = {
      cookie: expect.createSpy(),
    };

    save.default('testName', 'testVal', {}, resExpress);

    expect(resExpress.cookie)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('testName', 'testVal', save.defaultExpressOpts);

    const resHapi = {
      state: expect.createSpy(),
    };

    save.default('testName', 'testVal', {}, resHapi);

    expect(resHapi.state)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('testName', 'testVal', save.defaultHapiOpts);

    const resFastify = {
      setCookie: expect.createSpy(),
    };

    save.default('testName', 'testVal', {}, resFastify);

    expect(resFastify.setCookie)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('testName', 'testVal', save.defaultFastityOpts);
  });
});
