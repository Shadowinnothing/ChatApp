const expect = require('expect');

// import is real string
const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non string values', () => {
    expect(isRealString(null)).toBeFalsy();
  });

  it('should reject strings with only spaces', () => {
    expect(isRealString('    ')).toBeFalsy();
  });

  it('should allow strings with non space characters', () => {
    expect(isRealString('   GoNuggets   ')).toBeTruthy();
  });
});
