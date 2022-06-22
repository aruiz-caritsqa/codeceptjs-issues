const prefix = global.codeceptjs.config.get('plugins').customLocator.prefix || '$';

module.exports = new Proxy({
  _init() {
    I = actor();
  },

  bar() {
    return '//*[@id="password"]';
  },
  
  loginToBookstore(userName, password) {
    I.amOnPage(`/login`);
    // use the default customLocator prefix
    I.fillField(`${prefix}userName`, userName);
    // use the Proxy for this PageObject for the same customLocator prefex 
    I.fillField(this[`${prefix}bar`](), password);
    I.click(`${prefix}login`);
  }
}, {
  get(target, prop) {
    if (global.codeceptjs.config.get('plugins').customLocator && global.codeceptjs.config.get('plugins').customLocator.enabled) {
      const prefix = global.codeceptjs.config.get('plugins').customLocator.prefix || '$';
      if (prop.constructor.name === 'String' && prop.startsWith(prefix)) {
        const propWithoutPrefix = prop.replace(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), '');
        if(target[propWithoutPrefix]) {
          return target[propWithoutPrefix]
        };
        return (() => global.codeceptjs.locator.build(prop).simplify());
      }
    }
    return target[prop];
  }
})
