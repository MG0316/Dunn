const ghpages = require('gh-pages');
const chalk = require('chalk');

/**
 * Publishes the specified dir to github pages.
 *
 * @param {object} opts object with custom properties, depending on the deploy method.
 */
module.exports.callback = (opts) => {
  ghpages.publish(
    opts.dir,
    {
      repo: opts.repo,
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        chalk.green(console.log('Deployed!'));
      }
    },
  );
};
