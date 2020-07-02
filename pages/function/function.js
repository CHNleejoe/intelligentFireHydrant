// pages/function/function.js
var utils = require('../../utils/util.js');
var api = require('../../net/api.js');
var http = require('../../net/http.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeName: 0,

        buildingList: [],

        buildingBtns: [{
                btn_id: 0,
                icon: '../../statics/imgs/yujing.png',
                name: '预警信息',
                data: {
                    name: 'warnMessageNo',
                    type: 'warn'
                }
            },
            {
                btn_id: 1,
                icon: '../../statics/imgs/chuangt.png',
                name: '传统设备',
                data: {
                    name: 'traditionalDeviceNo',
                    type: 'normal'
                }
            },
            {
                btn_id: 2,
                icon: '../../statics/imgs/zhineng.png',
                name: '智能设备',
                data: {
                    name: 'smartDeviceNo',
                    type: 'normal'
                }
            },
            {
                btn_id: 3,
                icon: '../../statics/imgs/baoyang.png',
                name: '保养信息'
            }
        ]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const that = this;
        // that.getDeviceList()

    },

    onShow: function(options) {
        const that = this;
        that.getDeviceList()

    },
    /**
     * select列表切换函数
     * @param {*} event 事件对象
     */
    onChange(event) {
        this.setData({
            activeName: event.detail
        });
    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**
     * 获取建筑信息列表
     */
    getDeviceList() {
        const that = this;

        var url = api.deviceList

        http.get(url, {}, (res) => {
            console.log(res, 'deviceList')
            that.setData({
                buildingList: res.b
            })
        }, function() {})
    },

    /**
     * 点击4个btn进行跳转
     * @param {*} event 事件对象
     */
    clickDetailFunc(event) {
        const that = this;
        let type = event.currentTarget.dataset.functiontype,
            buildingId = event.currentTarget.dataset.buildingid,
            url;
        console.log('clickDetailFunc', event.currentTarget.dataset)

        switch (type) {
            case 0:
                url = '../warningInfo/warningInfo'
                break;
            case 1:
                url = '../tradition/tradition'
                utils.loadDictionary('traditional_device_type', app)
                utils.loadDictionary('device_status', app)
                break
            case 2:
                url = '../intelligent/intelligent'
                utils.loadDictionary('smart_device_type', app)
                utils.loadDictionary('device_status', app)
                break
            case 3:
                url = '../maintainInfo/maintainInfo'
                utils.loadDictionary('maintain_status', app)
                break
        }
        wx.navigateTo({
            url: url + '?buildingId=' + buildingId
        })

    }
})