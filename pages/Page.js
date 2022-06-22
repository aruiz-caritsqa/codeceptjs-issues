const { MethodMissingClass } = require('unmiss');

let self;
let I;

class Page extends MethodMissingClass {
  constructor() {
    super();
    self = this;
    self.I = actor();
  }

  methodMissing(name, args) {
    const prefix = global.codeceptjs.config.get('plugins').customLocator.prefix || '$';
    if (global.codeceptjs.config.get('plugins').customLocator && global.codeceptjs.config.get('plugins').customLocator.enabled) {
      const propWithoutPrefix = prop.replace(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), '');
      if (prop.constructor.name === 'String' && prop.startsWith(prefix)) {
        if(target[propWithoutPrefix]) return target[propWithoutPrefix];
        return (() => global.codeceptjs.locator.build(prop).simplify());
      }
    }
    throw new Error(`${this.consturctor.name}.${name} is not a function - perhaps you need to prefix the function name with the customLocator (${prefix})?`);
  }
}
module.exports = Page;