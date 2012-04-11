#!/bin/bash

java -jar ~/local/yuicompressor/yuicompressor-2.4.7.jar -o '.js$:.min.js' --type js `ls js/*[^m][^i][^n].js`
java -jar ~/local/yuicompressor/yuicompressor-2.4.7.jar -o '.css$:.min.css' --type css `ls style/*[^m][^i][^n].css`

java -jar ~/local/yuicompressor/yuicompressor-2.4.7.jar -o '.js$:.min.js' --type js `ls */book.js`
