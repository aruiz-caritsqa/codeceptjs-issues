Feature(`
  As a tester
  I want to be able to use a Proxy for page objects with the customLocator plugin`)

const prefix = global.codeceptjs.config.get('plugins').customLocator.prefix || '$';

Scenario.skip('Login to demoqa', async ({ I, LoginPage }) => {
  // use the standard customLocator prefix
  // Can just do I.fillField('$userName', 'x'); if the prefix is known
  I.amOnPage('/login');
  I.fillField(`${prefix}userName`, 'test123');
  I.fillField(`${prefix}password`, 'test123');
  I.click(`${prefix}login`);
  I.waitForElement(`${prefix}output`, 5);
  I.wait(1)
  
  // using the customLocator prefix from within a Page Object that has a proxy to capture missing methods
  LoginPage.loginToBookstore('test456', 'test456');
  I.wait(1)

  // use the customLocator Proxy on a Page Object in a Scenario
  // Can just do I.fillField(LoginPage.$userName(), 'x'); if the prefix is known
  I.fillField(LoginPage[`${prefix}userName`](), 'test789');
  I.fillField(LoginPage[`${prefix}bar`](), 'test789');
  I.wait(1)
});  

Scenario.skip('Open book from /books page - prove Proxy added to container.js works as expected', async ({ I, BooksPage, BookPage }) => {
  I.amOnPage('/books');
  BooksPage.openNthBook(2);
  I.seeInCurrentUrl('/books?book=')

  // Prove container.js proxy works
  I.click(BooksPage[`${prefix}addNewRecordButton`]())
  I.dontSeeInCurrentUrl('/books?book=')

  // Prove container.js proxy works
  I.click(BookPage[`${prefix}login`]());
  I.seeInCurrentUrl('/login');
});

Scenario.skip('Open book from /books page - expected fail when BooksPage calls a non-existant function ${prefix}searchBox function', async ({ I, BooksPage }) => {
  I.amOnPage('/books');
  global.expect(() => BooksPage.search('Git')).to.throw('this[prefix] is not a function');
});

Scenario('Validating Book Data using Page Object Classes with unmiss for capturing missing methods', async ({ I, BooksPage, BookPage }) => {
  I.amOnPage('/books');
  BooksPage.openNthBook(2);
  I.seeInCurrentUrl('/books?book=')

  let url = await I.grabCurrentUrl();
  const [, isbn] = url.match(/books\?book=([0-9]+)$/);

  // validate using customLocator
  const valueByCustomLocator = await I.grabTextFrom(`${prefix}userName-value`);
  I.expect(isbn).to.equal(valueByCustomLocator);

  // validate using Page Object Class function
  const valueByPoFunc = await I.grabTextFrom(BookPage[`${prefix}userName-value`]());
  I.expect(isbn).to.equal(valueByPoFunc);

  // validate using Page Object Class call
  await BookPage.validateIsbn(isbn);
});

