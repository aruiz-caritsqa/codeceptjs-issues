const prefix = global.codeceptjs.config.get('plugins').customLocator.prefix || '$';

const Page = require('./Page');
let self;
let I;

class BookPage extends Page {
  constructor() {
    super();
    self = this;
    ({ I } = self);
  }

  async validateIsbn(isbn) {
    const value = await I.grabTextFrom(`${prefix}userName-value`);
    I.expect(isbn).to.equal(value);
  }
}
module.exports = new BookPage();