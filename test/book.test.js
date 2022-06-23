Feature(`
  As a tester
  I want to be able to use a Proxy for page objects with the customLocator plugin`)

const prefix = global.codeceptjs.config.get('plugins').customLocator.prefix || '$';

Scenario('Books on demoqa.com', async ({ I }) => {
  // use the standard customLocator prefix
  // Can just do I.fillField('$userName', 'x'); if the prefix is known
  I.amOnPage('/books');

  await I.wait(1);
  await I.checkImage('books-page.png')
});
