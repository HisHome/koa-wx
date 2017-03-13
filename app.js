'use strict'

var Koa = require('koa');//koa框架
var wechat = require('./wechat/g');//引入g.js
var config = require('./config')//引入config.js
var weixin = require('./weixin')//引入weixin.js

var app = new Koa();
app.use(wechat(config.wechat,weixin.reply))

app.listen(3080)
console.log('listening:3080');
