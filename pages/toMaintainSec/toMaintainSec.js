// pages/toMaintain/toMaintain.js
var utils = require('../../utils/util.js');
var api = require('../../net/api.js');
var http = require('../../net/http.js');
const app = getApp();
const qiniuUploader = require("../../utils/qiniuUploader");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        fileList: [],

        maintainId: '',
        deviceInfo: {}

    },
    /**
     * 上传图片
     * @param {*} event 
     */
    afterRead(event) {
        const { file } = event.detail;
        const that = this;
        that.fetchUptoken(file).then(res => {
            let uptoken = res.b.uploadToken,
                accessUrl = res.b.accessUrl,
                key = res.b.key,
                config = {
                    useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                    region: null // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
                },
                putExtra = {
                    fname: file.path, //文件原文件名
                    params: {}, //用来放置自定义变量
                    mimeType: null //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
                };
            console.log({ // 参数设置  地区代码 token domain 和直传的链接 注意七牛四个不同地域的链接不一样，我使用的是华南地区
                region: 'SCN',
                uptoken: uptoken,
                uploadURL: accessUrl,
                domain: accessUrl
            })
            var domain = accessUrl.split('/')
            domain.pop()
            domain = domain.join('/')
                //使用引入的qiniuUploader方法调七牛上传的接口
            qiniuUploader.upload(
                file.path, //上传的图片
                (res) => { //回调 success
                    console.log(res)
                    var fileList = that.data.fileList
                    fileList.push({...file, url: res.imageURL });
                    that.setData({
                        fileList,
                    })

                }, (error) => { //回调 fail
                    console.log('error: ', error);
                }, { // 参数设置  地区代码 token domain 和直传的链接 注意七牛四个不同地域的链接不一样，我使用的是华南地区
                    region: 'SCN',
                    uptoken: uptoken,
                    uploadURL: accessUrl,
                    key: key,
                    domain: domain
                })

        })

    },
    /**
     * 获取七牛云的文件上传许可
     * @param {*} file 文件对象
     */
    fetchUptoken: function(file) {
        var url = api.uploadFile
        console.log(file.path.substring(file.path.lastIndexOf('.') + 1))
        return new Promise(function(resolve, reject) {
            http.get(url, {
                suffix: file.path.substring(file.path.lastIndexOf('.') + 1)
            }, res => {
                console.log(res)
                resolve(res)
            })
        })
    },
    /**
     * 删除图片
     * @param {object} event 事件对象
     */
    afterDelete(event) {
        const { index } = event.detail;
        const that = this;
        var fileList = that.data.fileList
        fileList.splice(index, 1)
        that.setData({
            fileList,
        })
    },
    /**
     * 设置数组中的radio数据
     * @param {*} event 
     */
    setRadioVal(event) {
        let index = event.currentTarget.dataset.index
        let deviceInfo = this.data.deviceInfo
        deviceInfo.maintainSituation[index].result = event.detail
        this.setData({
            deviceInfo
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const that = this;
        options.deviceInfo = JSON.parse(options.deviceInfo)
        options.deviceInfo.maintainSituation.map(item => {
            if (!item.result) {
                item.result = '1'
            }
        })
        that.setData({
            deviceInfo: options.deviceInfo,
            maintainId: options.maintainId
        })
    },

    uploadMaintainTaskInfo() {
        const that = this;
        var url = api.addMaintainTaskForOneEquipment,
            maintainPhotoUrls = [];
        that.data.fileList.map(item => {
            maintainPhotoUrls.push(item.url)
        })
        maintainPhotoUrls = maintainPhotoUrls.join(',')
        http.post(url, {
            maintainId: that.data.maintainId,
            deviceId: that.data.deviceInfo.deviceId,
            maintainSituation: JSON.stringify(that.data.deviceInfo.maintainSituation),
            maintainPhotoUrls: maintainPhotoUrls
                // maintainPersonIds: that.data.maintainPersonIds,
                // remark: that.data.remark,
        }, res => {
            wx.showToast({
                title: '设备保养完成',
                icon: 'success',
            });
            setTimeout(function() {
                wx.navigateBack({
                    delta: 2, // 回退前 delta(默认为1) 页面
                    success: function(res) {
                        // success
                    },
                    fail: function() {
                        // fail
                    },
                    complete: function() {
                        // complete
                    }
                })
            }, 1000)

        })
    }
})