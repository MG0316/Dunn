#!/usr/bin/env node

const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
const inquirer    = require('./lib/inquirer');
const {actionPicker} = require('./lib/actions');
// clear();
// console.log(
//   chalk.yellow(
//     figlet.textSync('Dunn', { horizontalLayout: 'full' })
//   )
// );
// const run = async () => {
//     const credentials = await inquirer.ask();
//     console.log(credentials);
//   }
  
//run();

actionPicker()

