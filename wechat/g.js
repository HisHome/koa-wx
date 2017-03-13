'use strict'

var sha1 = require('sha1');
var Wechat = require('./wechat.js')
var util = require('./util.js')
var getRawBody = require('raw-body')
var WechatAPI = require('wechat-api');
var menu = {  //菜单menu
    "button": [{
            "type": "view",
            "name": "1号杂货铺",
            "url": "http://libs.willclass.com/student/html/thinking.html"
        },
        {
            "name": "2号小店",
            "sub_button": [{
                    "type": "view",
                    "name": "搜索",
                    "url": "http://www.baidu.com/"
                },
                {
                    "type": "click",
                    "name": "赞一下我们",
                    "key": "V1001_GOOD"
                }
            ]
        }
    ]
}

module.exports = function(opts, handler) {
    var wechat = new Wechat(opts); //实例化Wechat 进行access_token的获取或者更新
    var api = new WechatAPI(opts.appID, opts.appSecret);//实例化WechatAPI
    return function*(next) {
        // 在开发者后台 进行url和token验证 是通过get方式 访问这个url
        var that = this;
        var token = opts.token;
        var signature = this.query.signature;
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var echostr = this.query.echostr;
        var str = [token, timestamp, nonce].sort().join('');//排序并转化为字符串
        var sha = sha1(str);//对字符串进行sha1加密

      //   创建菜单
        api.createMenu(menu, function(err) {
            if (err) {
                console.log("菜单" + err);
            };
            console.log("创建菜单完成");
        });

        if (this.method === 'GET') {//对配置的url和token进行比对
            if (sha === signature) {
                this.body = echostr + "";//返回echostr
            } else {
                this.body = 'wrong'
            }
        } else if (this.method === 'POST') {
            if (sha !== signature) {
                this.body = 'wrong'
                return false
            }
            // 获取用户发来的消息 并设置消息文本的大小，长度，编码格式
            var data = yield getRawBody(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            })

            // 将用户发来的消息xml解析成对象
            var message1 = yield util.parseXMLAsync(data)

            // 进一步将对象中的数组解析出来
            var message = util.formatMessage(message1.xml)
            console.log(message1);
            console.log('----用户发来的---');

            this.weixin = message;
            yield handler.call(this, next)
            wechat.reply.call(this)

        }

        // console.log(this);
        // console.log(message);
    }
}
