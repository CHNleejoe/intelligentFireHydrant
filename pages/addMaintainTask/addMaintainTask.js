// pages/addMaintainTask/addMaintainTask.js
var util = require('../../utils/util.js');
var api = require('../../net/api.js');
var http = require('../../net/http.js');
var dayjs = require('../../utils/dayjs.min.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        planBeginDate: '2020-4-1',
        planEndDate: '2020-4-1',
        buildingName: '请选择物业小区',
        buildingId: '',
        equipmentAdress: '',
        equipmentNum: 12,
        userInfo: app.globalData.userInfo,
        options: {},
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
        companyId: '',
        companyName: '',
        buildingPickerControl: false,
        buildingColumns: [],
        buildingIdColumns: [],
        buildingOrganList: [],

        // 保养类型选择器
        maintainTypeLabel: '请选择保养类型',
        maintainTypeId: '',
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var planBeginDate = util.formatTimeWithoutHMS(new Date()),
            planEndDate = util.formatTimeWithoutHMS(new Date());
        options.buildingInfo = JSON.parse(options.buildingInfo)
        console.log(app.globalData.userInfo, options)
        this.setData({
            planBeginDate,
            planEndDate,
            userInfo: app.globalData.userInfo,

            options: options,
            equipmentNum: options.buildingInfo.traditionalDeviceNo,

        })
        this.loadMaintainType()
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
    openBuildingPikerControl() {
        const that = this;
        const url = api.proprietorList

        http.get(url, {}, res => {
            var cols = [],
                cols_id = [],
                oragn_list = []
            res.b.data.map(item => {
                cols.push(item.proprietorName)
                cols_id.push(item.proprietorId)
                oragn_list.push(item.organList)

            })
            that.setData({
                buildingColumns: cols,
                buildingIdColumns: cols_id,
                buildingOrganList: oragn_list,
                buildingPickerControl: true
            })
        })
    },
    confrimBuildingPickerData(event) {
        let type = event.currentTarget.dataset.type
        const { picker, value, index } = event.detail;
        const that = this;
        var companyName = '',
            companyId = '';

        that.data.buildingOrganList[index].map(item => {
            if (app.globalData.userType == item.organType) {
                companyName = item.organName
                companyId = item.organId
            }
        })
        this.setData({
            buildingPickerControl: false,
            buildingName: value,
            buildingId: that.data.buildingIdColumns[index],
            companyName,
            companyId
        })

    },
    closeBuildingPikerControl() {
        this.setData({ buildingPickerControl: false });
    },
    /**
     * 选择对应的公司
     * @param {x} event 事件对象
     */
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
     * 新增保养任务
     */
    addMaintainTask() {
        const that = this;
        if (dayjs(that.data.planBeginDate).valueOf() > dayjs(that.data.planEndDate).valueOf()) {
            wx.showToast({
                title: '开始时间不能大于结束时间',
                icon: 'none',
            });
            return
        } else if (that.data.maintainTypeId == '') {
            wx.showToast({
                title: '保养类型不能为空',
                icon: 'none',
            });
            return
        }
        var url = api.addMaintainTask
        http.post(url, {
            proprietorId: that.data.buildingId,
            beginPlaneTime: that.data.planBeginDate,
            endPlaneTime: that.data.planEndDate,
            mainOrgId: that.data.companyId,
            mainTypeId: that.data.maintainTypeId,
            // remark: that.data.remark
        }, res => {
            wx.showToast({
                title: '任务新增成功',
                icon: 'success',
            });
            setTimeout(function() {
                wx.navigateBack()
            }, 1000)
        })
    },

    /**
     * 
     */
    loadMaintainType() {
        const that = this;
        var url = api.maintainType
        http.get(url, {}, res => {
            var maintainList = []
            console.log(res)
            res.b.map(item => {
                maintainList.push({
                    maintainTypeLabel: item.typeName,
                    maintainTypeId: item.typeId,
                })
            })
            that.setData({
                maintainTypeList: maintainList
            })
        })
    }
})