const fs = require("fs");
const fm = require("front-matter");
const path = require("path");
const {
  createDirectory,
  readFiles,
  writeFile,
  readFile,
  readFilesRecursive
} = require("../../helpers/io");
const build_dir = "./build";

function loadIndex() {
  let index = readFile('../../src/index.html')
  let file = fm(index)
  let attr = file.attributes
  let render = require(`../../../src/plugins/${attr.plugin}`).callback; //get the callback to render the html
  writeFile(
    build_dir+'/',
    "index.html", //filename to be exported
    render(file.body, { content: '<h1> This is my index </h1>' }) //render the html
  );
}

function loadFileTree() {
  readFilesRecursive(
    "./src/contents/",
    (filename, file, d) => parse(file, filename, d),
    name => createDirectory(`${build_dir}/contents`, name)
  );
}

function loadStyles() {
  readFiles("./src/style/", (filename, file) => {
    writeFile("./build/style/", filename, file);
  });
}

function parse(file, filename, dirToBeWritten) {
  console.log(dirToBeWritten);
  //first read all
  let body = fm(file).body; //get the file body
  let attr = fm(file).attributes; //get the rest of the attributes, i.e. template, title, etc..
  let layout = fm(readFile(`../../src/templates/${attr.template}`)); //get the right template for the post
  //then:

  let html = require(`../../../src/plugins/${attr.plugin}`).callback(body); //apply the callback and render the markdown
  let render = require(`../../../src/plugins/${layout.attributes.plugin}`).callback; //get the callback to render the html

  //then, export:
  writeFile(
    build_dir + dirToBeWritten.slice(5), //dir to be exported, delete the ./src and add ./build
    filename + ".html", //filename to be exported
    render(layout.body, { title: attr.title, content: html }) //render the html
  );
}

function loadContent() {
  loadStyles()
  loadIndex()
  loadFileTree()
}
/**
 * Builds the project structure.
 */

function build() {
  createDirectory(build_dir);
  createDirectory(build_dir, "./style");
  createDirectory(build_dir, "./contents");
  loadContent()
}

//return the build function, which when called will generate a build directory on the project root,
//and then add all files correctly compiled and placed into their directories.
module.exports = { build: build };
