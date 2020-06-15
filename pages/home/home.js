// pages/home/home.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mapData: {
            longitude: '113.951535',
            latitude: '22.563576',
            scale: 15,

        },
        markers: [{
                id: 1,
                longitude: '113.951535',
                latitude: '22.563576',
                iconPath: '../../statics/imgs/dingwei.png',
                time: '2020-01-22 12:22:33'
            },
            {
                id: 2,
                longitude: '113.94929',
                latitude: '22.563042',
                iconPath: '../../statics/imgs/dingwei.png',
                time: '2020-01-22 12:22:33'
            },
            {
                id: 3,
                longitude: '113.949999',
                latitude: '22.569992',
                iconPath: '../../statics/imgs/dingwei.png',
                time: '2020-01-22 12:22:33'
            },
            {
                id: 4,
                longitude: '113.949999',
                latitude: '22.569992',
                iconPath: '../../statics/imgs/dingwei.png',
                time: '2020-01-22 12:22:33'
            }
        ],
        markerIndex: 0

    },

    changeMarker(event) {
        const that = this;
        let index = event.currentTarget.dataset.index,
            longitude = that.data.markers[index].longitude,
            latitude = that.data.markers[index].latitude

        that.setData({
            markerIndex: index,
            longitude: longitude,
            latitude: latitude
        })
        this.mapCtx.moveToLocation()

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(app.data.userType)
        this.setData({
            userType: app.data.userType
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.mapCtx = wx.createMapContext('myMap')
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})