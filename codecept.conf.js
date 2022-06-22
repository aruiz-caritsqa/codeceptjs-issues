const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const { expect } = chai;
global.expect = expect;


// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();


exports.config = {
  tests: './test/*.test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://demoqa.com',
      show: true,
      windowSize: '1200x900'
    }
  },
  plugins: {
    customLocator: {
      enabled: true,
      attribute: 'id',
      prefix: '$',
    }
  },
  include: {
    I: './steps_file.js',
    LoginPage: './pages/LoginPage.js',
    BooksPage: './pages/BooksPage.js',
    BookPage: './pages/BookPage.js',
  },
  bootstrap: null,
  mocha: {},
  name: 'codeceptjs-issues'
}