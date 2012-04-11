#!/bin/bash

java -jar ~/local/yuicompressor/yuicompressor-2.4.7.jar -o '.js$:.min.js' --type js `ls -1 js/*.js | sed 's/.*min.js//'`
java -jar ~/local/yuicompressor/yuicompressor-2.4.7.jar -o '.css$:.min.css' --type css `ls -1 style/*.css | sed 's/.*min.css//'`

java -jar ~/local/yuicompressor/yuicompressor-2.4.7.jar -o '.js$:.min.js' --type js `ls */book.js`
