//mine.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        js_code: 'wxRg6ySSs9pswF20PikhNL1Y6bui4IxNXuhjGDiGghUeqiMdIC184XkJPr0ZT2G0'
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
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
        this.getUserId()
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    bindGetUserInfo(e) {
        console.log(e.detail.userInfo)
    },
    /**
     * 获取用户信息
     */
    toGetUserInfo() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求， 可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
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
                        userInfo: res,
                        hasUserInfo: true
                    })
                }
            })
        }
        console.warn(this.data.userInfo, app.globalData.userInfo, 'userFino');
    },
    /**
     * 点击授权允许处理函数
     */
    handleOpenType() {
        const that = this

        this.requestLogin(_ => {
            that.setData({
                chanceCtl: true,
                tipCtl: false
            })
        })
    },
    /**
     * 获取用户登陆状态和登陆验证函数
     */
    requestLogin(callback = function() {}) {
        const that = this
        wx.login({
            success: function(r) {
                var code = r.code; //登录凭证
                that.setData({
                    code: code
                })
                if (code) {
                    that.getUserId()
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
        app.globalData.userInfo = e.detail.userInfo
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
                    that.getUserId()
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
    getUserId() {
        const that = this
        var url = that.data.requestLocation + '/user/login/wechat',
            js_code = that.data.js_code;
        console.log(123123)

        var app = getApp();
        wx.request({
            url: url,
            data: { js_code },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: function(res) {
                console.log(res, 'getUserId')

                if (res.data.success) {
                    app.globalData.openId = res.data.data.openid
                    that.requestForUserTestResult(res.data.data.openid)
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: function() {},
            complete: function() {}
        })

    },
})