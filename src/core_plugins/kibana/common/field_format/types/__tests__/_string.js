import expect from 'expect.js';
import { stringifyString } from '../string';

describe('String Format', function () {

  let StringFormat;

  beforeEach(function () {
    StringFormat = stringifyString();
  });

// TODO fix base64 encoded to not use window.atob
/*
  it('decode a base64 string', function () {
    const string = new StringFormat({
      transform: 'base64'
    });
    expect(string.convert('Zm9vYmFy')).to.be('foobar');
  });
*/

  it('convert a string to title case', function () {
    const string = new StringFormat({
      transform: 'title'
    });
    expect(string.convert('PLEASE DO NOT SHOUT')).to.be('Please Do Not Shout');
    expect(string.convert('Mean, variance and standard_deviation.')).to.be('Mean, Variance And Standard_deviation.');
    expect(string.convert('Stay CALM!')).to.be('Stay Calm!');
  });

});
