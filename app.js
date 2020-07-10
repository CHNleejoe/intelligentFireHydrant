//app.js

App({
    data: {},
    watch: function(ctx, obj) {
        Object.keys(obj).forEach(key => {
            this.observer(ctx.data, key, ctx.data[key], function(value) {
                obj[key].call(ctx, value)
            })
        })
    },
    // 监听属性，并执行监听函数
    observer: function(data, key, val, fn) {
        Object.defineProperty(data, key, {
            configurable: true,
            enumerable: true,
            get: function() {
                return val
            },
            set: function(newVal) {
                if (newVal === val) return
                fn && fn(newVal)
                val = newVal
            },
        })
    },
    onLaunch: function() {
        var util = require('utils/util.js')

        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        util.loadDictionary('organ_type', this)
        util.loadDictionary('maintain_status', this)

        const that = this;

        wx.getSetting({
            success: res => {
                console.log(res)

                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                    return
                    wx.login({
                        success: function(r) {
                            console.log(r, 'getUserInfo')

                            var code = r.code; //登录凭证
                            if (code) {
                                //2、调用获取用户信息接口
                                that.getUserOpenId(code)
                            } else {
                                console.log('获取用户登录态失败！' + r.errMsg)
                            }
                        },
                        fail: function() {
                            callback(false)
                        }
                    })
                }
            }
        })
    },
    /**
     * 获取用户的openid
     */
    getUserOpenId(js_code = this.data.js_code) {
        var api = require('./net/api.js');
        var http = require('./net/http.js');
        const that = this
        var url = api.openId;
        http.get(url, {
            jsCode: js_code
        }, (res) => {
            console.log(res, 'getUserOpenId')

            that.globalData.openId = res.b.openId
            that.getUserInfoByOpenIdFromBackend(res.b.openId)
        }, function() {})
    },
    /**
     * 获取用户后台信息
     */
    getUserInfoByOpenIdFromBackend(openId) {
        var api = require('./net/api.js');
        var http = require('./net/http.js');
        var util = require('utils/util.js')

        const that = this
        var url = api.userInfoByOpenidFromBackend
        http.post(url, {
            wechatOpenId: openId
        }, (res) => {
            if (res.b.userInfo) {
                var userType = util.parseDictionary(that, 'organ_type', res.b.userInfo ? res.b.userInfo.userType : '')

                var userBaseInfo = {
                    ...that.globalData.userInfo,
                    ...res.b.userInfo
                }
                userBaseInfo.userType = userType
                that.globalData.userInfo = userBaseInfo
            }
            that.globalData.userStatus = res.b.certificationStatus
            that.globalData.userType = res.b.userInfo ? res.b.userInfo.userType : null
            that.globalData.proprietorList = res.b.proprietorList

        }, function() {})
    },
    globalData: {
        userInfo: null,
        proprietorList: null,
        userType: null,
        userStatus: null,

        // requestLocation: 'http://192.168.3.21:8080/fhms-saas/api/app/v1',
        requestLocation: 'http://192.168.3.171:8282/fhms-saas/api/app/v1',
        version: 'v1',
        openId: '',
        dictionarys: {},

        timer: null

    },
    /**
     * 用户分享自定义
     */
    onShareAppMessage: function(res) {
        return {
            title: '锦瀚智慧消防栓系统',
            path: '/pages/home/home',
            imageUrl: 'statics/imgs/logo.jpeg' //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
        }
    }
})