//mine.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var api = require('../../net/api.js');
var http = require('../../net/http.js');

Page({
    data: {
        userInfo: app.globalData.userInfo,
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        baseInfo: '',
        userType: '',
        userStatus: app.globalData.userStatus,
        info: {
            mobile: '',
            code: '',
            name: ''
        },

        companyTypeControl: false,
        companyType: '',
        companyTypeVal: '',
        companyTypeColumns: [],
        companyTypeValColumns: [],

        companyControl: false,
        company: '',
        companyVal: '',
        companyColumns: [],
        companyValColumns: [],
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function(options) {
        if (options.baseInfo) {
            console.log(options)
            var baseInfo = JSON.parse(options.baseInfo),
                userInfo = JSON.parse(options.userInfo)
            this.setData({
                baseInfo,
                userInfo
            })
        }
        // this.getUserOpenId()
        this.requestCompanyType()
    },
    requestCompanyType() {
        const that = this;
        util.loadDictionary('organ_type', app, function() {
            var cols = [],
                cols_val = []
            app.globalData.dictionarys.organ_type.map(item => {
                cols.push(item.name)
                cols_val.push(item.value)
            })
            that.setData({
                companyTypeColumns: cols,
                companyTypeValColumns: cols_val
            })
        }, that)

    },
    showPicker(event) {
        let type = event.currentTarget.dataset.type
        switch (type) {
            case 'companyType':
                {
                    this.setData({
                        companyTypeControl: true
                    })
                }
                break;
            case 'company':
                {
                    this.setData({
                        companyControl: true
                    })
                }
                break;
        }
    },
    fieldChange(event) {
        const that = this;
        var info_ = that.data.info;
        let dataset = event.currentTarget.dataset,
            value = event.detail,
            name = dataset.val;
        info_[name] = value
        that.data[name] = value;
        that.setData({
            info: info_
        })

    },
    sendMobileCode() {
        const that = this;
        const url = api.mobileCode;
        if (that.data.info.mobile == '') {
            wx.showToast({
                title: "请输入手机号",
                duration: 2000,
                icon: 'none'
            })
            return
        } else if (!util.checkMobile(that.data.mobile)) {
            wx.showToast({
                title: "不是完整的11位手机号或者正确的手机号前七位",
                duration: 2000,
                icon: 'none'
            })
            return
        }
        http.get(url, {
            mobile: that.data.info.mobile,
            type: 1
        }, res => {
            console.log(res)
        })
    },
    confrimPickerData(event) {
        let type = event.currentTarget.dataset.type
        const { picker, value, index } = event.detail;
        const that = this;
        switch (type) {
            case 'companyType':
                {
                    this.setData({
                        companyTypeControl: false,
                        companyType: value,
                        companyTypeVal: that.data.companyTypeValColumns[index],
                        company: '',
                        companyVal: ''
                    })
                    const url = api.organListByType
                    http.get(url, {
                        organType: that.data.companyTypeValColumns[index]
                    }, res => {
                        var cols = [],
                            cols_id = []
                        res.b.data.map(item => {
                            cols.push(item.organName)
                            cols_id.push(item.organId)
                        })
                        that.setData({
                            companyColumns: cols,
                            companyValColumns: cols_id,
                        })
                    })
                }
                break;
            case 'company':
                {
                    this.setData({
                        companyControl: false,
                        company: value,
                        companyVal: that.data.companyValColumns[index]
                    })
                }
                break;
        }
    },
    closePicker(event) {
        let type = event.currentTarget.dataset.type
        switch (type) {
            case 'companyType':
                {
                    this.setData({
                        companyTypeControl: false
                    })
                }
                break;
            case 'company':
                {
                    this.setData({
                        companyControl: false
                    })
                }
                break;
        }
    },

    submitUserinfo() {
        const url = api.certifyUser
        const that = this;
        if (that.data.info.mobile == '') {
            wx.showToast({
                title: "请输入手机号",
                duration: 2000,
                icon: 'none'
            })
            return
        } else if (!util.checkMobile(that.data.info.mobile)) {
            wx.showToast({
                title: "不是完整的11位手机号或者正确的手机号前七位",
                duration: 2000,
                icon: 'none'
            })
            return
        } else if (!that.data.info.code) {
            wx.showToast({
                title: "请输入验证码",
                duration: 2000,
                icon: 'none'
            })
            return
        } else if (!that.data.info.name) {
            wx.showToast({
                title: "请输入真实的名字",
                duration: 2000,
                icon: 'none'
            })
            return
        } else if (!that.data.companyTypeVal) {
            wx.showToast({
                title: "请选择公司类型",
                duration: 2000,
                icon: 'none'
            })
            return
        } else if (!that.data.companyVal) {
            wx.showToast({
                title: "请选择所属公司",
                duration: 2000,
                icon: 'none'
            })
            return
        }
        http.post(url, {
            mobile: that.data.mobile,
            code: that.data.code,
            wechatOpenId: app.globalData.openId,
            name: that.data.name,
            orgType: that.data.companyTypeVal,
            orgId: that.data.companyVal,
        }, res => {
            wx.showToast({
                title: '用户认证完成，等待审核中',
                icon: 'success',
            });
            setTimeout(function() {
                wx.navigateBack()
            }, 1000)
        })
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
                    that.getUserOpenId()
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
    getUserOpenId() {
        const that = this
        var url = api.openId,
            js_code = that.data.js_code;

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
            var userType = util.parseDictionary(app, 'organ_type', res.b.userInfo.userType),
                userStatus = util.parseCertificationStatus(res.b.certificationStatus)

            console.log(userType, 'getUserInfoByOpenIdFromBackend')
            app.globalData.userInfo = res.b.userInfo
            app.globalData.userStatus = res.b.certificationStatus
            that.setData({
                userInfo: res.b.userInfo,
                hasUserInfo: true,
                userType,
                userStatus
            })
        }, function() {})
    }
})