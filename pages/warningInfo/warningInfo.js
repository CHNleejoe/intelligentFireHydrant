// pages/warningInfo/warningInfo.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var api = require('../../net/api.js');
var http = require('../../net/http.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        mapData: {
            longitude: '113.951535',
            latitude: '22.563576',
            scale: 18,
        },
        markers: [],
        markerIndex: 0,

        proprietorList: []

    },
    onLoad: function(options) {
        this.setData({
            options: options
        })
        this.loadWarningInfo(options)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        const that = this;
        this.mapCtx = wx.createMapContext('homeMap')
    },

    /**
     * 点击对应的预警信息定位到对应的地点
     * @param {*} event 
     */
    changeMarker(event) {
        const that = this;
        let index = event.currentTarget.dataset.index,
            longitude = that.data.markers[index].posLong,
            latitude = that.data.markers[index].posLatitude

        that.setData({
            markerIndex: index,
            longitude: longitude,
            latitude: latitude
        })
        console.log(this.mapCtx.moveToLocation, latitude, longitude, 'mapCtx')
        this.mapCtx.moveToLocation({
            longitude: longitude,
            latitude: latitude,
        })
    },
    loadWarningInfo(options = null) {
        let url = api.intelligentWarningListByBuildingId
        const that = this;
        http.get(url, {
            proprietorId: options ? options.buildingId : ''
        }, res => {
            console.log(res, 'intelligentWarningListByBuildingId')
            that.setData({
                markers: res.b.list,
                mapData: {
                    longitude: res.b.list[0].posLong,
                    latitude: res.b.list[0].posLatitude
                },
            })
        })
    },
    cameraQrCode() {
        wx.scanCode({
            onlyFromCamera: false,
            scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
            success: res => {
                if (res.errMsg == 'scanCode:ok') {
                    wx.navigateTo({
                        url: '../tradEquipmentDetail/tradEquipmentDetail?deviceId=' + res.result
                    })
                }
            },
            fail: res => {
                // 接口调用失败
            },
            complete: res => {
                // 接口调用结束
                console.log(res)
            }
        });
    }
})