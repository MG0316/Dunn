---
layout: post
title:  "Can it go any further?"
date:   March 2, 2018
template: layout.ejs
plugin: markdown.js
author: Juanqui Loco. 
---

Further steps
------------

Since we are following a highly modular approach. It can.


Dunn lets you deploy your work to any platform you like. When you call the `dunn -d` option or `dunn --deploy`, the program will look for the `dunn.config.js` file and get the plugins specified under the `deploy` attribute. Dunn will iterate over the array and apply each of the plugins to the build directory (in case you wanted to do multiple deploys in one line, the program doesn't care, is all up to you!). 




### Deploy plugins and callbacks ###

A deploy plugin will follow the following pattern:

~~~
define foobar(opts) {
    //do your work..
}
~~~

Although it seems pretty straight forward, there are certain rules for writing your own deploy plugins:

 1. Make sure to export the callback function using the CommonJS syntax `module.exports.callback`.

 2. The `opts` parameter is an object that you created, so you can use it as you wish. 

 3. When calling the opts object inside your callback, make sure to be using the same names as the ones in the 'plugin-opts' attribute in the deploy plugins array.

 4. As usual, save your custom plugin on the /plugins directory.

That's pretty much it, go crazy! 

