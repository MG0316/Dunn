var inquirer = require("inquirer");
module.exports = {
    ask: () => {
        var style = {
            message: "Which would you like to use?",
            type: "checkbox",
            name: "styles",
            choices: [
                { name: "CSS", checked: true },
                { name: "SASS" }
            ]
        };
        return inquirer.prompt(style);
    }
}


