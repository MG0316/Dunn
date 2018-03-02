const getUsage = require('command-line-usage');

// Set the help menu to be shown in console
const sections = [
  {
    header: 'Dunn StaticSiteGenerator',
    content:
      'This is y(our) static site generator. Dunn will create and run your site in the bat of an eye.',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'preview [-p]',
        short: 'p',
        description:
          'Runs an [underline]{existing} project instance into a server for visualization',
      },
      {
        name: 'build [-b]',
        short: 'b',
        description: 'Builds an [underline]{existing} project instance',
      },
      {
        name: 'deploy [-d]',
        short: 'd',
        description: 'Deploys the build folder using the specified plugin (if specified)',
      },
      {
        name: 'help [-h]',
        short: 'h',
        description: 'Prints this usage guide.',
      },
    ],
  },
];

// export the function to print in console
module.exports = { help: () => { console.log(getUsage(sections)); } };
