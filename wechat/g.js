'use strict'

var sha1 = require('sha1');
var Wechat = require('./wechat.js')
var util = require('./util.js')
var getRawBody = require('raw-body')

var WechatAPI = require('wechat-api');

var api = new WechatAPI('wx50adb3417b18a54b', 'c65dbc2e6bb0ccdf6e20b2343d32666b');

var menu={
    "button":[
      {
        "type":"view",
        "name":"1号杂货铺",
        "url":"http://libs.willclass.com/student/html/thinking.html"
      },
      {
        "name":"2号小店",
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

module.exports = function(opts){
   var wechat = new Wechat(opts);
   return function *(next){
      // console.log(this.query);
      var that =this;
      var token = opts.token;
      var signature = this.query.signature;
      var nonce = this.query.nonce;
      var timestamp = this.query.timestamp;
      var echostr = this.query.echostr;
      var str = [token,timestamp,nonce].sort().join('');
      var sha = sha1(str);

      api.createMenu(menu, function(err){
         console.log('--13131---');
         // console.log(result);

         if (err) {
      		console.log("菜单" + err);
      	};
      	console.log("创建菜单完成");

      });
      if(this.method === 'GET'){
         if(sha === signature){
            this.body = echostr + "";
         }else{
            this.body = 'wrong'
         }



      }else if(this.method === 'POST'){
         if(sha !== signature){
            this.body = 'wrong'
            return false
         }
         // 设置消息文本
         var data = yield getRawBody(this.req,{
            length: this.length,
            limit: '1mb',
            encoding: this.charset
         })

         // 讲xml解析成对象
         var content = yield util.parseXMLAsync(data)
         // console.log(content);

         // 进一步将对象中的数组解析出来
         var message = util.formatMessage(content.xml)
         console.log(message);

         // 判断解析出来的消息类型是不是event
         if(message.MsgType === 'event'){

            // 关注公众号的事件
            if(message.Event === 'subscribe'){
               var now = new Date().getTime();
               that.status = 200
               that.type = 'application/xml'
               that.body = '<xml>'+
                           '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
                           '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
                           '<CreateTime>'+now+'</CreateTime>'+
                           '<MsgType><![CDATA[text]]></MsgType>'+
                           '<Content><![CDATA[你好,谢谢你的关注,很多功能正在开发中，不要着急哦！]]></Content>'+
                           '</xml>'

               return
            }
            if(message.EventKey=='today_music'){
               var now = new Date().getTime();
               that.status = 200
               that.type = 'application/xml'
               that.body = '<xml>'+
                           '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
                           '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
                           '<CreateTime>'+now+'</CreateTime>'+
                           '<MsgType><![CDATA[text]]></MsgType>'+
                           '<Content><![CDATA[点击了今日音乐！]]></Content>'+
                           '</xml>'

               return
            }
         }

      }

      // console.log(this);
      // console.log(message);

   }
}
