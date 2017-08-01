/*
 * The Server for the Article Hunter RSS Feed Trawler.
 */

'use static'
var express = require('express');
var mysql = require('mysql');

var app = express();

// Constant page directory
var pages = __dirname + '/pages/';

// Static files
app.use('/', express.static(pages, { extensions: ['html'] }));
