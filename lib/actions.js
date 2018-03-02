const chalk = require('chalk');
const figlet = require('figlet');
const args = require('minimist')(process.argv.slice(2));

const actionPicker = () => {
  if (args.h || args.help) {
    console.log(chalk.yellow(figlet.textSync('Dunn', { horizontalLayout: 'full' })));
    require('./commands/help/help').help();
  } else if (args.p || args.preview) {
    require('./commands/preview/preview').preview();
  } else if (args.b || args.build) {
    require('./commands/build/build').build();
  } else {
    console.log(chalk.yellow(figlet.textSync('Dunn', { horizontalLayout: 'full' })));
    require('./commands/help/help').help();
  }
};

module.exports = {
  actionPicker,
};
