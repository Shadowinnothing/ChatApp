const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

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

describe('generateLocationMessage', () => {
  it('should generate correct location obj', () => {
    const from = 'Ryan';
    const lat = 39.7487;    // Pepsi center
    const long = -105.0077; // Go Nuggets!
    const url = `http://www.google.com/maps?q=39.7487,-105.0077`;
    const mes = generateLocationMessage(from, lat, long);

    expect(mes.createdAt).toBeA('number');
    expect(mes).toInclude({from});
    expect(mes.url).toEqual(url);
  });
});
