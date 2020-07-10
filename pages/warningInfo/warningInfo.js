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
        mapMarkers: [],
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
            longitude = that.data.mapMarkers[index].longitude,
            latitude = that.data.mapMarkers[index].latitude
        var mapMarkers = that.data.mapMarkers
        mapMarkers[that.data.markerIndex].callout.display = 'BYCLICK'
        mapMarkers[index].callout.display = 'ALWAYS'
        that.setData({
            markerIndex: index,
            longitude: longitude,
            latitude: latitude,
            mapMarkers
        })
        console.log(latitude, longitude, 'mapCtx')
        that.mapCtx.moveToLocation({
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
            var mapMarkers = []
            if (!res.b || !res.b.list) {
                that.setData({
                    mapMarkers: mapMarkers,
                    markers: [],
                    mapData: {
                        longitude: 110,
                        latitude: 33
                    },
                });
                return
            }
            res.b.list.map((item, index) => {
                var tmp = {}
                tmp.id = index
                var localtionObject = util.convert2TecentMap(item.proprietorPosLong, item.proprietorPosLatitude)
                tmp.longitude = localtionObject.lng
                tmp.latitude = localtionObject.lat
                tmp.iconPath = '../../statics/imgs/dingwei.png'
                tmp.location = item.posLong + '.' + item.posLatitude
                tmp.callout = {
                        content: `地址：${item.locationDetail}\n设备编码：${item.snCode}\n监测值：${item.monitorData[0].value}\n监测时间：${item.monitorTime}`, //文本
                        color: '#FF0202', //文本颜色
                        borderRadius: 3, //边框圆角
                        borderWidth: 1, //边框宽度
                        borderColor: '#FF0202', //边框颜色
                        bgColor: '#ffffff', //背景色
                        padding: 5, //文本边缘留白
                        display: that.data.markerIndex == index ? 'ALWAYS' : 'BYCLICK',
                        textAlign: 'center' //文本对齐方式。有效值: left, right, center
                    }
                    // tmp.longitude = that.data.mapData.longitude
                    // tmp.latitude = that.data.mapData.latitude
                mapMarkers.push(tmp)
            })
            that.setData({
                mapMarkers: mapMarkers,
                markers: res.b.list,
                mapData: {
                    longitude: res.b.list[0].posLong,
                    latitude: res.b.list[0].posLatitude
                },
            })
            that.mapCtx.moveToLocation({
                longitude: mapMarkers[0].longitude,
                latitude: mapMarkers[0].latitude,
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