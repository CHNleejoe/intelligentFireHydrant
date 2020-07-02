// pages/toMaintain/toMaintain.js
var util = require('../../utils/util.js');
var api = require('../../net/api.js');
var http = require('../../net/http.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        devicePopupCrl: false,
        deviceColumns: [],
        detailInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            options: options
        })
        this.loadData(options)
    },
    /**
     * 加载数据
     */
    loadData: function(options, callback) {
        var that = this;
        var url = api.maintainDetailInfoForTraditionDevice
        let maintainId = options.maintainId ? options.maintainId : that.data.options.maintainId

        http.get(url, {
            maintainId,
        }, res => {
            console.log('maintainDetailInfoForTraditionDevice', res)
                // res.b.map(i => {
                //     i.status_label = util.parseDictionary(app, 'maintain_status', i.status)
                // })
            that.setData({
                detailInfo: res.b
            });
            if (callback) {
                callback();
            }
        })
    },
    confrimPickerData(event) {
        let type = event.currentTarget.dataset.type
        const { picker, value, index } = event.detail;
        const that = this;
        that.setData({
            devicePopupCrl: false
        })
        var url = '../toMaintainSec/toMaintainSec'
        wx.navigateTo({
            url: url + '?deviceInfo=' + JSON.stringify(that.data.detailInfo.maintainDeviceList[index]) + '&maintainId=' + that.data.detailInfo.maintainId
        })

    },
    closePicker(event) {
        this.setData({
            devicePopupCrl: false
        })
    },
    showDevicePopup() {
        const that = this;

        var cols = []
        that.data.detailInfo.maintainDeviceList.map(item => {
            cols.push(item.snCode)
        })
        that.setData({
            deviceColumns: cols,
            devicePopupCrl: true
        })
    },
    saomaToUpLoad() {
        const that = this;
        wx.scanCode({
            onlyFromCamera: false,
            scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
            success: res => {
                if (res.errMsg == 'scanCode:ok') {
                    for (let index = 0; index < that.data.detailInfo.maintainDeviceList.length; index++) {
                        if (that.data.detailInfo.maintainDeviceList[i].snCode == res.result) {
                            wx.navigateTo({
                                url: '../toMaintainSec/toMaintainSec?deviceInfo=' + JSON.stringify(that.data.detailInfo.maintainDeviceList[index]) + '&maintainId=' + that.data.detailInfo.maintainId
                            })
                            return
                        }
                    }
                }
            },
            fail: res => {
                // 接口调用失败
                wx.showToast({
                    icon: 'none',
                    title: '接口调用失败！'
                })
            },
            complete: res => {
                // 接口调用结束
                console.log(res)
            }
        });
    }
})