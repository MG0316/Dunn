const { help } = require("./commands/help");
const { newProject } = require("./commands/new");
const { preview } = require("./commands/preview");
const { build } = require("./commands/build");
const { args } = require("./cli-operations");

const actionPicker = () => {
  if (args.h || args.help) {
    help();
  } else if (args.n || args.new) {
    newProject();
  } else if (args.p || args.preview) {
    preview();
  } else if (args.b || args.build) {
    build();
  }
};

module.exports = {
  actionPicker: actionPicker
};
