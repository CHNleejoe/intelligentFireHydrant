// pages/addMaintainTask/addMaintainTask.js
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        planBeginDate: '2020-1-1',
        planEndDate: '2020-4-1',
        buildingName: '',
        equipmentAdress: '',
        equipmentNum: 12,

        // 时间选择器
        beginTimePickerControl: false,
        beginTime: new Date().getTime(),
        endTimePickerControl: false,
        endTime: new Date().getTime(),
        minDate: new Date().getTime(),
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`;
            }
            return value;
        },
        // 单选器图标
        radioIcon: {
            normal: '../../statics/imgs/ok_not.png',
            active: '../../statics/imgs/ok.png',
        },
        // 公司选择器
        companyId: '1',
        companyName: '请选择物业公司',
        companyPickerControl: false,
        companyList: [{
            companyName: '物业公司',
            companyId: '1'
        }, {
            companyName: '维修公司',
            companyId: '2'
        }, {
            companyName: '业主公司',
            companyId: '3'
        }, ],

        // 保养类型选择器
        maintainTypeLabel: '请选择保养类型',
        maintainTypeId: '1',
        maintainTypePickerControl: false,
        maintainTypeList: [{
            maintainTypeLabel: '基本保养',
            maintainTypeId: '1'
        }, {
            maintainTypeLabel: '设备维修',
            maintainTypeId: '2'
        }, {
            maintainTypeLabel: '设备巡检',
            maintainTypeId: '3'
        }, ],

    },
    /**
     * 时间选择器控制函数
     * @param {*} options 
     */
    openBeginTimePickerControl() {
        this.setData({ beginTimePickerControl: true });
    },
    closeBeginTimePickerControl() {
        this.setData({ beginTimePickerControl: false });
    },
    confirmBeginTime(event) {
        console.log(event, 'confirmBeginTime')
        var time = util.formatTimeWithoutHMS(new Date(event.detail));
        this.setData({
            planBeginDate: time,
            beginTimePickerControl: false
        })
    },
    openEndTimePickerControl() {
        this.setData({ endTimePickerControl: true });
    },
    closeEndTimePickerControl() {
        this.setData({ endTimePickerControl: false });
    },
    confirmEndTime(event) {
        console.log(event, 'confirmEndTime')
        var time = util.formatTimeWithoutHMS(new Date(event.detail));
        this.setData({
            planEndDate: time,
            endTimePickerControl: false
        })
    },
    /**
     * 选择物业公司
     * @param {*} options 
     */
    openCompanyPikerControl() {
        this.setData({ companyPickerControl: true });
    },
    closeCompanyPikerControl() {
        this.setData({ companyPickerControl: false });
    },
    clickCompanyId(event) {
        const { name, label } = event.currentTarget.dataset;
        this.setData({
            companyId: name,
            companyName: label
        });
    },
    /**
     * 选择保养类型
     * @param {*} options 
     */
    openMaintainTypePikerControl() {
        this.setData({ maintainTypePickerControl: true });
    },
    closeMaintainTypePikerControl() {
        this.setData({ maintainTypePickerControl: false });
    },
    clickMaintainTypeId(event) {
        const { name, label } = event.currentTarget.dataset;
        this.setData({
            maintainTypeId: name,
            maintainTypeLabel: label
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