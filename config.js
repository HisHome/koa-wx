'use strict'

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
   }

}

module.exports = config
