const { setCommonPlugins } = require('@codeceptjs/configure');
const fs = require('fs');

let browser = process.env.BROWSER || 'webkit';
// global.expect(browser).to.be.oneOf(['puppeteer', 'chrome', 'safari', 'firefox'])
const isHeadless = !!process.env.HEADLESS;

const browserSize = () => {
  switch (process.env.SIZE) {
    case 'xSmall':
      return { w: 320, h: 568 };
    case 'small':
      return { w: 375, h: 812 };
    case 'medium':
      return { w: 768, h: 1024 };
    case 'large':
      return { w: 1440, h: 900 };
    case 'xLarge':
      return { w: 1920, h: 1080 };
    case 'xxLarge':
      return { w: 3840, h: 2160 };
    default:
      return { w: 1440, h: 900 };
  }
};

const wdioBrowsers = [
  'chrome',
  'firefox',
  'safari',
  'MicrosoftEdge',
];

const playwrightBrowsers = [
  'chromium',
  'webkit',
];

console.log(`=> url: ${global.TEST_URL}`);
console.log(`=> browser: ${browser}`);
console.log(`=> isHeadless: ${isHeadless}`);
console.log(`=> size: ${JSON.stringify(browserSize())}`);

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const { expect } = chai;
global.expect = expect;

global.TEST_URL = 'https://demoqa.com';

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

const frameworkType = (browser) => {
  if (wdioBrowsers.includes(browser)) {
    return 'wdio';
  } if (playwrightBrowsers.includes(browser)) {
    return 'playwright';
  }
  return 'puppeteer';
};

exports.config = {
  tests: './test/*.test.js',
  output: './output',
  helpers: {
    ...(frameworkType(browser) === 'puppeteer' && { 
      Puppeteer: {
        url: global.TEST_URL,
        windowSize: `${browserSize().w}x${browserSize().h}`,
        show: !isHeadless,
        chrome: {
          args: []
        }
      }
    }),
    ...(frameworkType(browser) === 'wdio' && {
      WebDriver: {
        url: global.TEST_URL,
        browser,
        show: true,
        path: '/',
        host: 'localhost',
        windowSize: `${browserSize().w}x${browserSize().h}`,
        logLevel: 'info',
        seleniumArgs: {
        },
        desiredCapabilities: {
          ...(browser === 'firefox' && { 
            'moz:firefoxOptions': {
              args: [
                ...(isHeadless ? ['--headless'] : []),
                `--width=${browserSize().h}`,
                `--height=${browserSize().h}`
              ]
            },
          }),
          ...(browser === 'MicrosoftEdge' && { 
            'ms:edgeOptions': {
              args: [
                ...(isHeadless ? ['-headless'] : []),
              ]
            },
          }),          
          ...(browser === 'chrome' && {
            'goog:chromeOptions': {
              args: [
                '--incognito',
                ...(isHeadless ? [
                  '--headless',
                  '--disable-gpu',
                  '--no-sandbox',
                ]: []),
                ...(['xSmall', 'small', 'medium'].includes(process.env.SIZE) ? [
                  '--user-agent="Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36"',
                ] : []),
              ],
            },
          }),
        },
        logLevel: "debug",
      }  
    }),
    ...(frameworkType(browser) === 'playwright' && {
      Playwright: {
        url: global.TEST_URL,
        browser,
        show: !isHeadless,
        windowSize: `${browserSize().w}x${browserSize().h}`,
        logLevel: 'debug',
      },
    }),  
    PixelmatchHelper: {
      require:      "codeceptjs-pixelmatchhelper",  // Mandatory and static!
      dirExpected:  "./visreg/screenshots/base/",    // Optional but recommended.
      dirDiff:      "./visreg/screenshots/diff/",    // Optional but recommended.
      dirActual:    "./output/",              // Optional.
      diffPrefix:   "Diff_",                        // Optional.
      tolerance:    0,                            // Optional.
      threshold:    0.05,                           // Optional.
      dumpIntermediateImage: false,                  // Optional.
      captureActual: false,                          // Optional.
      captureExpected: false                         // Optional.      
  }
  },
  plugins: {
    customLocator: {
      enabled: true,
      attribute: 'id',
      prefix: '$',
    },
    ...(frameworkType(browser) === 'wdio' && {
      wdio: {
        enabled: true,
        services: ['selenium-standalone'],
      },
    }),      
  },
  include: {
    I: './steps_file.js',
    LoginPage: './pages/LoginPage.js',
  },
  bootstrap: null,
  mocha: {
    "reporterOptions": {
      "reportDir": "output",
      "mochaFile": "output/result.xml"    
    },
  },
  name: 'codeceptjs-issues',

  async bootstrap() {
    // try {
    //   fs.rmdirSync(`${process.cwd()}/allure-report`, { recursive: true, force: true })
    // } catch(e) {
    //   console.log(`failed to delete allure-report`)
    // }

    // try {
    //   fs.rmdirSync(`${process.cwd()}/allure-results`, { recursive: true, force: true })
    // } catch(e) {
    //   console.log(`failed to delete allure-results`)
    // }

    // try {
    //   fs.rmdirSync(`${process.cwd()}/non-functional-reports`, { recursive: true, force: true })
    // } catch(e) {
    //   console.log(`failed to delete non-functional-reports`)
    // }    

    // try {
    //   fs.mkdirSync(`${process.cwd()}/allure-report`);
    // } catch(e) {
    //   console.log(`failed to create allure-report`)
    // }

    // try {
    //   fs.mkdirSync(`${process.cwd()}/allure-results`);
    // } catch(e) {
    //   console.log(`failed to create allure-results`)
    // }   

    try {
      fs.rmdirSync(`${process.cwd()}/visreg/screenshots/diff`, { recursive: true, force: true })
    } catch(e) {
      console.log(`failed to delete visreg/screenshots/diff: ${e}`)
    }    

    try {
      fs.rmdirSync(`${process.cwd()}/output`, { recursive: true, force: true })
    } catch(e) {
      console.log(`failed to delete output: ${e}`)
    }        

   try {
      fs.mkdirSync(`${process.cwd()}/output`);
    } catch(e) {
      console.log(`failed to create output: ${e}`)
    }   
  },
}