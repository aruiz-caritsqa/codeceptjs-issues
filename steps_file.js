// in this file you can append custom step methods to 'I' object
const Jimp = require('jimp');
const fs = require('fs');

module.exports = function() {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.

    async checkImage(name) {
      if (!/\.png/i.test(name)) {
        throw new Error('checkImage :: image name must end in ".png"')
      }
      
      await this.saveScreenshot(name, true);
      const outputDir = codeceptjs.container.helpers()['PixelmatchHelper'].config.dirActual || codeceptjs.config.get('output');
      const baseDir = codeceptjs.container.helpers()['PixelmatchHelper'].config.dirExpected;

      const baseImage = await Jimp.read(`${baseDir}/${name}`);
      await Jimp.read(`${outputDir}/${name}`)
        .then(image => {
          return image
            .contain(baseImage.bitmap.width, baseImage.bitmap.height, Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_TOP) // resize
            .writeAsync(`${outputDir}/${name}`); // save
        })
        .catch(err => {
          console.error(err);
        });
      
      const res = await this.getVisualDifferences(name);
      if (res.match) {
        // Identical enough. Difference is 0%
        this.say(`Identical enough. Difference is ${res.difference}%`);
      } else {
        // Too different. Difference is 1.2345% - review Diff_dashboard.png for details!
        this.say(`Too different. Difference is ${res.difference}% - review ${res.diffImage} for details!`);
      }      
    }
  });
}
