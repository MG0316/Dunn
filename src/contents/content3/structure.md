---
title:  "Plugin structure"
date:   February 15, 2018
template: layout.ejs
plugin: markdown.js
author: John Doe
---
Plugin structure
------------

It is important to know the difference between each of the plugins you can create. 

### Markdown ###

Markdown plugins will follow a structure like this one:

~~~
define foobar(file) {
    //do your work..
    //return (rendered md to html)
}
~~~
### Template ###

Template plugins will follow a structure like this one:

~~~
define foobar(layout, attributes) {
    //do your work..
    //return (rendered layout with attributes inserted)
}
~~~
### Style ###

Style plugins will follow a structure like this one:

~~~
define foobar(file, filename) {
    //do your work..
    //return (processed file)
}
~~~

### Rules ###

 1. Make sure to export the callback function using the CommonJS syntax `module.exports.callback`. The name **matters**.

 2. As usual, save your custom plugin on the /plugins directory.
 
 3. Unless you want to see a googleplexian number of erros, try not to mix plugins (render templates with markdown plugins and so on).


