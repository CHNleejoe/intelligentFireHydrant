//mine.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var api = require('../../net/api.js');
var http = require('../../net/http.js');

Page({
    data: {
        userInfo: getApp().globalData.userInfo,
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        js_code: '',
        userType: getApp().globalData.userType,
        userStatus: ''
    },
    //事件处理函数
    bindTurnToCerity: function() {
        const that = this
        var _url = '../certify/certify'
        console.warn(_url)
        if ((app.globalData.userStatus && app.globalData.userStatus != 1) || !that.data.hasUserInfo) return
        wx.navigateTo({
            url: _url + '?baseInfo=' + JSON.stringify(null) + '&userInfo=' + JSON.stringify(that.data.userInfo)
        })
    },
    onShow: function() {
        var userStatus = util.parseCertificationStatus(app.globalData.userStatus)
        this.setData({
            userInfo: app.globalData.userInfo,
            userStatus
        })
    },
    onLoad: function() {
        if (app.globalData.userInfo) {
            var userStatus = util.parseCertificationStatus(app.globalData.userStatus)
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
                userStatus
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                app.globalData.userInfo = res.userInfo
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    /**
     * 点击授权允许处理函数
     */
    handleOpenType(e) {
        const that = this
        if (e.detail.userInfo) {
            this.requestLogin(_ => {
                that.setData({
                    chanceCtl: true,
                    tipCtl: false
                })
            })
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        } else {

        }
    },
    /**
     * 获取用户登陆状态和登陆验证函数
     */
    requestLogin(callback = function() {}) {

        const that = this
        wx.login({
            success: function(r) {
                console.log(r)

                var code = r.code; //登录凭证

                that.setData({
                    js_code: code
                })
                if (code) {
                    that.getUserOpenId()
                    if (callback) {
                        callback()
                    }
                } else {
                    console.log('获取用户登录态失败！' + r.errMsg)
                }
            }
        })
    },
    /**
     * 获取用户信息
     */
    getUserInfo: function(e) {
        console.log(e)
            // app.globalData.userInfo = e.detail.userInfo
        const that = this
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
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
    },
    /**
     * 获取用户的openid
     */
    getUserOpenId(js_code = this.data.js_code) {
        const that = this
        var url = api.openId;


        var app = getApp();
        http.get(url, {
            jsCode: js_code
        }, (res) => {
            console.log(res, 'getUserOpenId')

            app.globalData.openId = res.b.openId
            that.getUserInfoByOpenIdFromBackend(res.b.openId)
        }, function() {})
    },
    /**
     * 获取用户后台信息
     */
    getUserInfoByOpenIdFromBackend(openId) {
        const that = this
        var url = api.userInfoByOpenidFromBackend

        var app = getApp();
        http.post(url, {
            wechatOpenId: openId
        }, (res) => {
            var userType = util.parseDictionary(app, 'organ_type', res.b.userInfo ? res.b.userInfo.userType : ''),
                userStatus = util.parseCertificationStatus(res.b.certificationStatus)
            if (res.b.userInfo) {
                var userBaseInfo = {
                    ...that.data.userInfo,
                    userTypeLable: userType,
                    ...res.b.userInfo
                }
                app.globalData.userInfo = userBaseInfo

                that.setData({
                    userInfo: userBaseInfo
                })
            }
            console.log(userType, 'getUserInfoByOpenIdFromBackend')
            app.globalData.userStatus = res.b.certificationStatus
            app.globalData.proprietorList = res.b.proprietorList

            that.setData({
                hasUserInfo: true,
                userType,
                userStatus
            })
            if (res.b.certificationStatus == 1) {
                var _url = '../certify/certify'
                wx.navigateTo({
                    url: _url + '?baseInfo=' + JSON.stringify(res.b.userInfo) + '&userInfo=' + JSON.stringify(that.data.userInfo)
                })
            }
        }, function() {})
    }
})