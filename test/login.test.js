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

Scenario('Open book from /books page - prove Proxy added to container.js works as expected', async ({ I, BooksPage, BookPage }) => {
  I.amOnPage('/books');
  BooksPage.openNthBook(2);
  I.seeInCurrentUrl('/books?book=')
  I.click(BooksPage[`${prefix}addNewRecordButton`]())
  I.dontSeeInCurrentUrl('/books?book=')

  I.click(BookPage[`${prefix}login`]());
  I.seeInCurrentUrl('/login');
});

Scenario('Open book from /books page - expected fail when BooksPage calls a non-existant function', async ({ I, BooksPage }) => {
  I.amOnPage('/books');
  BooksPage.search('Git');
});
