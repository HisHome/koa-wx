'use strict'
var config=require('./config')
var Wechat=require('./wechat/wechat')
var wechatAPI= new Wechat(config.wechat)



exports.reply = function* (next){

   var message = this.weixin;

   if(message.MsgType == 'event'){

      if(message.Event == 'subscribe'){
         if(message.EventKey){
            console.log('扫二维码'+ message.EventKey + ''+message.ticket);
         }
         this.body = '哈哈 你订阅了公众号'
      }else if(message.Event == 'unsubscribe'){
         console.log('无情取关注');
         this.body = ''
      }else if (message.Event == 'LOCATION') {
         this.body = '您当前的位置是：'+ message.Latitude + '/'+message.Longitude + '-' + message.Precision
      }else if(message.Event == 'CLICK'){
         this.body = '您点击了菜单：'+message.EventKey
      }else if(message.Event == 'SCAN'){
         console.log('关注后扫描二维码'+message.EventKey+'/'+message.Ticket);
         this.body = '看到扫一扫哦'
      }else if(message.Event == 'VIEW'){
         this.body = '您点击了菜单中的链接'+message.EventKey;
      }
   }else if(message.MsgType == 'text'){
      var content = message.Content;
      var reply = '请回复1，2，3，4'
      if(content=='1'){
         reply = '天下第一'
      }else if(content =='2'){
         reply='天下第二'
      }else if(content=='3'){
         reply='天下第三'
      }else if(content=='4'){
         reply=[{
            title:'技术改变世界',
            description:'这只是一个描述而已',
            picUrl:'http://img.mukewang.com/58c0b6490001000e04200261.jpg',
            url:'www.baidu.com'
         },{
            title:'苍茫大地谁主沉浮',
            description:'这只是一个描述而已哈还啊啊哈',
            picUrl:'http://img.mukewang.com/5333a2a10001064f02000200-200-200.jpg',
            url:'www.baidu.com'
         }]
      }else if (content == '5') {
         var data = yield wechatAPI.uploadMaterial('image',__dirname+'/2.jpg')
         console.log(data);
         reply={
            type:'image',
            mediaId:data.media_id
         }
      }else if (content == '6') {
         var data = yield wechatAPI.uploadMaterial('voice',__dirname+'/7320.mp3')
         console.log(data);
         reply={
            type:'voice',
            mediaId:data.media_id
         }
      }else if (content == '7') {
         var data = yield wechatAPI.uploadMaterial('video',__dirname+'/popo.mp4')
         console.log(data);
         reply={
            type:'video',
            mediaId:data.media_id
         }
      }
      this.body=reply
   }

   yield next

}
