'use strict'

var Koa = require('koa');
var path = require('path');
var wechat = require('./wechat/g');
// var menu = require('./wechat/menu');
var util = require('./libs/util')
var wechat_file = path.join(__dirname,'config/wechat.txt')
var config = {
   wechat:{
      appID:'wx50adb3417b18a54b',
      appSecret:'c65dbc2e6bb0ccdf6e20b2343d32666b',
      token:'pyweixin',
      getAccessToken:function(){
         return util.readFileAsync(wechat_file)
      },
      saveAccessToken:function(data){
         data=JSON.stringify(data);
         return util.writeFileAsync(wechat_file,data)
      }
   },
   menu:{
       "button":[
         {
           "type":"click",
           "name":"今日歌曲",
           "key":"V1001_TODAY_MUSIC"
         },
         {
           "name":"菜单",
           "sub_button":[
             {
               "type":"view",
               "name":"搜索",
               "url":"http://www.baidu.com/"
             },
             {
               "type":"click",
               "name":"赞一下我们",
               "key":"V1001_GOOD"
             }
           ]
         }
       ]
   }
}

var app = new Koa();


app.use(wechat(config.wechat))
// app.use(menu(config.menu))

app.listen(3080)
console.log('listening:3080');
