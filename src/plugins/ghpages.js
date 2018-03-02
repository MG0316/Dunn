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
      repo: opts.repo, // repo link for gh pages clone
    },
    (err) => {
      if (err) {
        console.log(err); // error
      } else {
        chalk.green(console.log(`Deployed! Page available at https://${opts.user}.github.io/${opts.repoName}`));
      }
    },
  );
};
