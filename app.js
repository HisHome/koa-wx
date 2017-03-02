'use strict'

var Koa = require('koa');
var path = require('path');
var wechat = require('./wechat/g');
var util = require('./libs/util')
var wechat_file = path.join(__dirname,'config/wechat.txt')
var config = {
   wechat:{
      appID:'wxf394e0b71f666b53',
      appSecret:'0b719dcddbdca73fca3144320d548ee0',
      token:'weixin',
      getAccessToken:function(){
         return util.readFileAsync(wechat_file)
      },
      saveAccessToken:function(data){
         data=JSON.stringify(data);
         return util.writeFileAsync(wechat_file,data)
      }
   }
}

var app = new Koa();
app.use(wechat(config.wechat))


app.listen(3030)
console.log('listening:3030');
