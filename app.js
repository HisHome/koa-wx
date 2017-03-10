'use strict'

var Koa = require('koa');
var path = require('path');
var wechat = require('./wechat/g');
var config = require('./config')
var weixin = require('./weixin')
var util = require('./libs/util')
var wechat_file = path.join(__dirname,'config/wechat.txt')


var app = new Koa();


app.use(wechat(config.wechat,weixin.reply))
// app.use(menu(config.menu))

app.listen(3080)
console.log('listening:3080');
