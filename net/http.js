const tips = {
    1: '抱歉，出现了一个错误',
    205: '暂无数据！',
    300: '页面重定向，注意信息安全！',
    400: '语法格式有误！，请检查错误输入',
    401: '登录失败！',
    404: '页面资源错误！',
    500: '服务器错误！'
}
var app = getApp();
//项目URL相同部分，减轻代码量，同时方便项目迁移
//这里因为我是本地调试，所以host不规范，实际上应该是你备案的域名信息

/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
function post(url, postData, doSuccess, doFail = undefined) {
    wx.showNavigationBarLoading();

    wx.request({
        //项目的真正接口，通过字符串拼接方式实现
        url: url,
        header: {
            // 'content-type': 'application/json'
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'auth_token': app.globalData.userInfo && app.globalData.userInfo.authToken ? app.globalData.userInfo.authToken : ''
        },
        data: postData,
        method: 'POST',
        success: function(res) {
            if (res.statusCode == 200 && res.data.h && res.data.h.code == 200) {
                doSuccess(res.data);
            } else {
                var errMsg;
                res.data.h ? errMsg = res.data.h.msg : res.errMsg
                wx.showToast({
                    title: errMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        },
        fail: function() {
            if (doFail) doFail();
        },
        complete: function() {
            wx.hideNavigationBarLoading();
        }
    })
}

//GET请求，不需传参，直接URL调用，
function get(url, data, doSuccess, doFail = undefined) {
    wx.showNavigationBarLoading();

    wx.request({
        url: url,
        data,
        header: {
            "content-type": "application/json;charset=UTF-8",
            // 'auth_token': '7f4be4cbc66c484bb4df27aaa79095ff'
            'auth_token': app.globalData.userInfo && app.globalData.userInfo.authToken ? app.globalData.userInfo.authToken : ''
        },
        method: 'GET',
        success: function(res) {
            if (res.statusCode == 200 && res.data.h && res.data.h.code == 200) {
                doSuccess(res.data);
            } else {
                var errMsg;
                res.data.h ? errMsg = res.data.h.msg : res.errMsg
                wx.showToast({
                    title: errMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        },
        fail: function() {
            if (doFail) doFail();
        },
        complete: function() {
            wx.hideNavigationBarLoading();
        }
    })
}

function upload(url, name, filePath, headers) {
    wx.showNavigationBarLoading();
    // let promise = new Promise(function(resolve, reject) {
    wx.uploadFile({
        url: url,
        filePath: filePath,
        name: name,
        header: {
            // "content-type": "application/json;charset=UTF-8",
            'auth_token': app.globalData.userInfo && app.globalData.userInfo.authToken ? app.globalData.userInfo.authToken : '',
            ...headers
        },
        success: function(res) {
            if (res.statusCode == 200 && res.data.h && res.data.h.code == 200) {
                doSuccess(res.data);
            } else {
                var errMsg;
                res.data.h ? errMsg = res.data.h.msg : res.errMsg
                wx.showToast({
                    title: errMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        },
        fail: function() {
            if (doFail) doFail();
        },
        complete: function() {
            wx.hideNavigationBarLoading();
        }
    });
    // });
    // return promise;
}
/**
 * module.exports用来导出代码
 * js文件中通过var call = require("../util/request.js") 加载
 * 在引入引入文件的时候" "里面的内容通过../../../这种类型，小程序的编译器会自动提示，因为你可能
 * 项目目录不止一级，不同的js文件对应的工具类的位置不一样
 */
module.exports.post = post;
module.exports.get = get;
module.exports.upload = upload;