'use strict'

var Promise = require('bluebird');
var request = Promise.promisify(require('request'))
var util = require('./util')
var fs=require('fs')
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
   accessToken:prefix + 'token?grant_type=client_credential',
   upload:prefix +'media/upload?',

}

function Wechat(opts){
   var that =this;
   //把opts的一些参数，方法赋给 Wechat
   this.appID=opts.appID;
   this.appSecret=opts.appSecret;
   this.getAccessToken=opts.getAccessToken;
   this.saveAccessToken=opts.saveAccessToken;
   //获取存在某处的access_token
   this.fetchAccessToken();
}

//获取新的access_token
Wechat.prototype.fetchAccessToken = function (data) {
   var that=this;

   if (this.access_token && this.expires_in) {
      if(this.isValidAccessToken(this)){
         return Promise.resolve(this)
      }
   }
   this.getAccessToken()
      .then(function(data){
         // data 获得的access_token数据
         try {
            data = JSON.parse(data);
         } catch (e) {
            // 报错就更新为新的access_token
            return that.updateAccessToken()
         }
         //对获取的access_token进行过期校验
         if(that.isValidAccessToken(data)){
            return Promise.resolve(data);
         }else{
            // 过期就更新
            return that.updateAccessToken()
         }
      })
      .then(function(data){
         // 将access_token和有效期赋给Wechat 以及保存这个access_token
         that.access_token=data.access_token;
         that.expires_in=data.expires_in;
         that.saveAccessToken(data);
         return Promise.resolve(data);
      })
}

//校验 获取的access_token是否存在  是否过期
Wechat.prototype.isValidAccessToken = function (data) {

   if( !data || !data.access_token || !data.expires_in){
      return false;
   }

   var access_token = data.access_token;
   var expires_in = data.expires_in;
   var now = (new Date().getTime())

   if(expires_in>now){
      return true;
   }else{
      return false;
   }

};

//获取新的access_token
Wechat.prototype.updateAccessToken = function () {
   var appID = this.appID
   var appSecret = this.appSecret
   var url = api.accessToken +'&appid=' + appID + '&secret='+ appSecret
   return new Promise(function(resolve, reject) {
      request({url:url,json:true}).then(function(response){
         var data = response.body;
         // console.log(response.body);
         var now = (new Date().getTime())
         var expires_in = now + (data.expires_in - 20)*1000
         data.expires_in = expires_in
         resolve(data);
      })
   });

}


Wechat.prototype.uploadMaterial = function (type,filepath) {
   var that=this
   var form={
      media:fs.createReadStream(filepath)
   }
   // var appID = this.appID
   // var appSecret = this.appSecret
   // var url = api.accessToken +'&appid=' + appID + '&secret='+ appSecret
   return new Promise(function(resolve, reject) {
      that.fetchAccessToken()
      .then(function(data){
         console.log(data);
         var url = api.upload+'access_token='+data.access_token+'&type='+type
         request({method:'POST',url:url,formData:form,json:true}).then(function(response){
            var _data = response.body;
            console.log(_data);
            if(_data){
               resolve(_data)
            }else{
               throw new Error('上传素材失败')
            }
         }).catch(function(err){
            reject(err)
         })
      })

   });

}

Wechat.prototype.reply = function () {
   var content = this.body
   var message = this.weixin

   var xml = util.tpl(content,message)

   this.status = 200
   this.type = 'application/xml'
   this.body = xml


}

module.exports = Wechat;
