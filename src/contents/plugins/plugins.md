---
layout: post
title:  "Granular?"
date:   March 1, 2018
template: handlebars.html
plugin: kramdown.js
author: Juan Diego A. 
---

The cool part
------------

Dunn is an SSG based on EJS (Embedded JS) and Markdown, meaning that most views use a default Markdown-EJS layout. Although it doesn't really end there. When the project was created, there was a magic directory called plugins. In this directory the user can input any parser to any markdown (being: markdown, kramdown, etc.) or templating engine (being: liquid, pug, jade, handlebars, etc. ) they like. Whatever happens is up to you.

### Ain't this cool? ###

Dunn comes with two markdown parsers (markdown, kramdown), and two template compilers (ejs, handlebars), you can combine them in whatever way you like (Actually, this view is compiled with a kramdown-handlebars combination, yes, that hipster). 

Maybe you are just not satisfied with this kind of flexibility, well, fear no more, it gets better. 

### Next level ###

You are absolutely free to write your own parser and templating engine compiler. **Are you insane?!** Actually, no. Just follow these steps:
  
1. Create your **.js** file with the name you like and add it to the plugins directory. 

2. Use the CommonJS syntax `module.exports.callback` to export your parser or compiler. Depending on the function the parameters will be different though.

3. Add your custom parser or compiler on your front matter. 


### What else? ###

This custom parser-compiler behavior is not limited to markdown and templates. It also works with styles. Just a little different. 

Currently, Dunn supports sass and css, although this is only because those are implemented by now. Style plugins work just as content plugins, but with a little tweak. When applying style plugins, Dunn reads the plugin array from left to right, appending the plugin results to the next one until reading the whole plugin array. Making possible to combine a sass processor with an uglify module, then again, is up to you. If you want to write your own style processor and apply it to the files, you are more than welcome to, although that seems rather odd and awfully complicated, but, what the app cares about is that you **can** do it. 
