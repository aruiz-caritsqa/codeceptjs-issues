const prefix = global.codeceptjs.config.get('plugins').customLocator.prefix || '$';

module.exports = {
  _init() {
    I = actor();
  },

  bookRows() {
    return '//div[@class="books-wrapper"]//div[@role="rowgroup"]'
  },

  openNthBook(index = 1) {
    I.click(`${this.bookRows()}[${index}]//a[contains(@href, "/books?book=")]`)
  },

  search(text) {
    // expected to fail because there is no searchbox function defined in this object, and no Proxy
    I.fillField(this[`${prefix}searchBox`](), 'Git');
  },
}
