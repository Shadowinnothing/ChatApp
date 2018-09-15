const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message obj', () => {
    const from = 'Ryan';
    const text = 'This is Test';
    const mes = generateMessage(from, text);
    //expect(mes.from).toBe('Ryan');
    //expect(mes.text).toBe('This is Test');
    expect(mes.createdAt).toBeA('number');
    expect(mes).toInclude({from, text});
  });
});
