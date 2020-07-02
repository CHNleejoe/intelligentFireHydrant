// pages/home/home.js
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
        userType: 1,

        proprietorList: [],

        pageNo: 1,
        pageSize: 10,
        maxCount: null,
        /**
         * 获取到的列表数据
         */
        maintainInfo: [],
        options: {},
        /**
         * 控制上拉到底部时是否出现 "数据加载中..."
         */
        hidden: true,
        /**
         * 数据是否正在加载中，避免数据多次加载
         */
        loadingData: false

    },
    /**
     * 生命周期函数--页面显示
     */
    onShow: function() {
        this.setData({
            userType: app.globalData.userType,
            userStatus: app.globalData.userStatus,
            proprietorList: app.globalData.proprietorList
        })
        this.data.userType == 2 && this.data.userType == 3 && this.loadWarningInfo()
        this.data.userType == 4 && this.loadMaintainTask()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        const that = this;
        this.mapCtx = wx.createMapContext('homeMap')
        wx.getSetting({
            success: res => {
                console.log(res)

                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

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

        const that = this
        var url = api.openId;
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
        http.post(url, {
            wechatOpenId: openId
        }, (res) => {
            if (res.b.userInfo) {
                var userType = util.parseDictionary(app, 'organ_type', res.b.userInfo ? res.b.userInfo.userType : '')

                var userBaseInfo = {
                    ...app.globalData.userInfo,
                    ...res.b.userInfo
                }
                userBaseInfo.userType = userType
                app.globalData.userInfo = userBaseInfo
            }
            app.globalData.userStatus = res.b.certificationStatus
            app.globalData.userType = res.b.userInfo ? res.b.userInfo.userType : null
            app.globalData.proprietorList = res.b.proprietorList
            that.setData({
                userType: res.b.userInfo ? res.b.userInfo.userType : null,
                userStatus: res.b.certificationStatus,
                proprietorList: res.b.proprietorList
            })
            that.data.userType == 2 && that.data.userType == 3 && that.loadWarningInfo()
            that.data.userType == 4 && that.loadMaintainTask()
        }, function() {})
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
    /**
     * 加载预警信息
     */
    loadWarningInfo() {
        let url = api.intelligentWarningListByBuildingId
        const that = this;
        if (!that.data.proprietorList) return
        http.get(url, {
            proprietorId: that.data.proprietorList[0].id
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
                    var deviceInfo = { deviceId: res.result }
                    wx.navigateTo({
                        url: '../tradEquipmentDetail/tradEquipmentDetail?deviceInfo=' + JSON.stringify(deviceInfo)
                    })
                }
            },
            fail: res => {

            },
            complete: res => {
                // 接口调用结束
                console.log(res)
            }
        });
    },
    turnToMaintainDetail(event) {
        let maintainitem = event.currentTarget.dataset.maintainitem,
            url;
        switch (maintainitem.status) {
            case 0:
                url = '../toMaintain/toMaintain'
                break;
            case 1:
                url = '../maintainDetail/maintainDetail'
                    // utils.loadDictionary('device_status', app)
                break
        }
        wx.navigateTo({
            url: url + '?buildingId=' + that.data.proprietorList[0].id
        })
    },
    turnToAddMaintainTask() {
        const that = this;
        util.loadDictionary('patrol_tradition_content', app)
        var url = '../addMaintainTask/addMaintainTask'
        wx.navigateTo({
            url: url + '?buildingInfo=' + JSON.stringify(that.data.proprietorList[0])
        })
    },
    loadMaintainTask(options = null) {
        const that = this;
        var url = api.maintainInfoForTraditionDeviceByBuildingId
        console.log(app.globalData)
        http.get(url, {
            proprietorId: that.data.proprietorList[0].id
        }, res => {
            var maintainInfo = res.b
            maintainInfo.map(item => {
                item.status_label = util.parseDictionary(app, 'maintain_status', item.status)
                console.log(util.parseDictionary(app, 'maintain_status', item.status))

                item.status == 0 && (item.status_class = 'stop')
                item.status == 1 && (item.status_class = 'maintain')
                item.status == 2 && (item.status_class = 'active')
            })
            that.setData({
                maintainInfo
            })
        })
    },
    bindTurnMaintainDetail(event) {
        const dataItem = event.currentTarget.dataset.item
        var url = '../maintainDetail/maintainDetail'
        if (dataItem.status == 0 || dataItem.status == 1) {
            url = '../toMaintain/toMaintain'
        }
        wx.navigateTo({
            url: url + '?maintainId=' + JSON.stringify(dataItem.maintainId)
        })
    },
})