---
layout: post
title:  "What is this?"
date:   March 1, 2018
template: layout.ejs
plugin: markdown.js
author: Juan Diego A. 
---
Dunn the SSG
------------

As the name suggests, Dunn is a tool to create static sites with minimum effort. 
In order to use it, you should first check if you have node and npm installed on your device. 
 
To start creating amazing sites run:
~~~
npx dunn-create-project
~~~
    
And follow through with the wizard. After running the program, you'll end up with a file structure just like this one:



### File structure###
It's important to know what does each folder and file represents:

 1. **Styles**: Here you can add your style scripts. Currently the app supports:
      * css
      * sass

 2. **Templates**: Here you have your project templates. Additionally, you can add partials into subfolders and call them if your templating engine supports it.

 3. **Content**: Here you add your content. Each page you want to publish or try needs to be on a subfolder within this directory. Each subfolder should then have it's markdown file with what do you want to be injected in your page.
 
 4. **Lib**: App scripts. Must certainly **not** recommend to alter any file in here. Whatever. Is up to you. I did warn you though. 

 5. **Index.html**: In this case, the app's entry point.

 6. **Dunn.config.json**: Project's general config file, things as the entry point are defined here. Do **not** erase. Just **don't**.
 
 7. **Plugins**: Fun part. Plain JS scripts with amazing functionalities. Further explanation of this on the next sections. 

### Continuing installation ###
After having the file structure created, run the following commands:
~~~
npm i
~~~
to install all the project's dependencies. And then: 
~~~
npm link
~~~
to make our project accesible with only the `dunn` command.

### Basic usage ###
 1. `dunn -p`: Raises a mock server for you to navigate your website.

 2. `dunn -b`: Builds your project into the /build directory.

 3. `dunn -h`: Plz hlp.

<!-- 
![example image](../../style/example-image.jpg "An exemplary image") -->

