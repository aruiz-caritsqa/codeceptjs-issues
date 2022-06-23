Feature(`
  As a tester
  I want to be able to use a Proxy for page objects with the customLocator plugin`)

const prefix = global.codeceptjs.config.get('plugins').customLocator.prefix || '$';

Scenario('Login to demoqa.com @login', async ({ I, LoginPage }) => {
  // use the standard customLocator prefix
  // Can just do I.fillField('$userName', 'x'); if the prefix is known
  I.amOnPage('/login');

  // await I.wait(1);
  // await I.checkImage('login-page.png')


  I.fillField(`${prefix}userName`, 'test123');
  I.fillField(`${prefix}password`, 'test123');
  I.click(`${prefix}login`);
  I.waitForElement(`${prefix}output`, 5);
  
  I.wait(1)
  await I.checkImage('login-failure.png')
});
