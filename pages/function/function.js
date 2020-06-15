// pages/function/function.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeName: 0,

        buildingList: [{
                id: 0,
                name: '华瀚创新s厦A座',
                num: 12,
                o_num: 1,
                n_num: 2,
                oragneList: [
                    { name: '建筑地址', value: '华瀚创新园华瀚座' },
                    { name: '维修公司', value: '华瀚科技控股物业有限公司' },
                    { name: '物业公司', value: '华瀚科技控股物业有限公司' },
                ]
            },
            {
                id: 1,
                name: '华瀚创新园华瀚s',
                num: 1,
                o_num: 1,
                n_num: 2,
                oragneList: [
                    { name: '建筑地址', value: '华瀚创新s技大厦A座' },
                    { name: '维修公司', value: '华瀚科技控股物业有限公司' },
                    { name: '物业公司', value: '华瀚科技s业有限公司' },
                ]
            },
            {
                id: 2,
                name: '华瀚创2华瀚科技大厦A座',
                num: 33,
                o_num: 1,
                n_num: 2,
                oragneList: [
                    { name: '建筑地址', value: '华瀚创新园华瀚科技大厦A座' },
                    { name: '维修公司', value: '华瀚科技s股物业有限公司' },
                    { name: '物业公司', value: '华瀚科技控股物s公司' },
                ]
            },
        ],

        buildingBtns: [{
                btn_id: 0,
                icon: '../../statics/imgs/yujing.png',
                name: '预警信息',
                data: {
                    name: 'num',
                    type: 'warn'
                }
            },
            {
                btn_id: 1,
                icon: '../../statics/imgs/chuangt.png',
                name: '传统设备',
                data: {
                    name: 'o_num',
                    type: 'normal'
                }
            },
            {
                btn_id: 2,
                icon: '../../statics/imgs/zhineng.png',
                name: '智能设备',
                data: {
                    name: 'n_num',
                    type: 'normal'
                }
            },
            {
                btn_id: 2,
                icon: '../../statics/imgs/baoyang.png',
                name: '保养信息'
            }
        ]
    },

    onChange(event) {
        console.log('onchange', event)
        this.setData({
            activeName: event.detail
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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