const app = getApp()


/** 登录相关 */
// 获取用户的openid
const openId = app.globalData.requestLocation + '/user/login/wechat/get/openid'
    // 依照openid获取后台存储的用户信息
const userInfoByOpenidFromBackend = app.globalData.requestLocation + '/user/login/wechat'
    // 获取组织列表
const organList = app.globalData.requestLocation + '/organ/list'
    // 用户实名认证上传
const certifyUser = app.globalData.requestLocation + '/user/certification/add'


/** 功能页面相关 */
// 获取功能页面的建筑物信息
const proprietorList = app.globalData.requestLocation + '/proprietor/list'
const deviceList = app.globalData.requestLocation + '/device/list'


/** 传统设备相关 */
// 依照建筑物ID获取传统设备
const traditionListByBuildingId = app.globalData.requestLocation + '/device/traditional/list/by/proprietor/id'
    // 根据设备id查询传统设备详情
const traditionDetailByDeviceId = app.globalData.requestLocation + '/device/traditional/detail/by/id'
    // 根据设备id和任务id查询传统设备详情
const traditionDetailByDeviceIdAndMaintainId = app.globalData.requestLocation + '/device/traditional/detail/by/id/2/maintain/id'


/** 智能设备相关 */
const intelligentList = app.globalData.requestLocation + '/device/smart/message/list'
const intelligentListByBuildingId = app.globalData.requestLocation + '/device/smart/list/by/proprietor/id'
    // 依据物业小区id获取智能设备告警信息列表
const intelligentWarningListByBuildingId = app.globalData.requestLocation + '/device/smart/warn/message/list'
    //  根据智能设备id查询预警信息
const intelligentWarningListByDeviceId = app.globalData.requestLocation + '/device/smart/warn/detail/by/id'
    // 根据智能设备id查询监测信息详情
const intelligentWarningDetailByDeviceId = app.globalData.requestLocation + '/device/smart/monitor/detail/by/id'


/** 传统设备保养相关 */
// 传统设备保养信息列表查询
const maintainInfoForTraditionDeviceByBuildingId = app.globalData.requestLocation + '/device/traditional/maintain/list/by/proprietor/id'
    // 传统设备保养信息详情查询
const maintainDetailInfoForTraditionDevice = app.globalData.requestLocation + '/device/traditional/maintain/detail'
    // 保养任务新增
const addMaintainTask = app.globalData.requestLocation + '/device/traditional/maintain/add'
    // 保养信息提交（单个设备）
const addMaintainTaskForOneEquipment = app.globalData.requestLocation + '/device/traditional/maintain/one/add'
    // 保养类型
const maintainType = app.globalData.requestLocation + '/device/traditional/maintain/type/list'

/** 公司单位功能 */
// 单位列表查询
const organListByType = app.globalData.requestLocation + '/organ/list'


/** 系统基础相关 */
// 依照类型获取数据字典
const dictionaryInfoByType = app.globalData.requestLocation + '/dictionary/info/by/type'
    // 获取验证码
const mobileCode = app.globalData.requestLocation + '/sms/code/get'
    // 七牛云上传图片
const uploadFile = app.globalData.requestLocation + '/public/upload/token'


module.exports = {
    openId: openId,
    userInfoByOpenidFromBackend: userInfoByOpenidFromBackend,
    organList: organList,
    proprietorList: proprietorList,
    deviceList: deviceList,
    intelligentList: intelligentList,
    intelligentListByBuildingId: intelligentListByBuildingId,
    traditionListByBuildingId: traditionListByBuildingId,
    dictionaryInfoByType: dictionaryInfoByType,
    intelligentWarningListByBuildingId: intelligentWarningListByBuildingId,
    intelligentWarningListByDeviceId: intelligentWarningListByDeviceId,
    maintainInfoForTraditionDeviceByBuildingId: maintainInfoForTraditionDeviceByBuildingId,
    maintainDetailInfoForTraditionDevice: maintainDetailInfoForTraditionDevice,
    intelligentWarningDetailByDeviceId: intelligentWarningDetailByDeviceId,
    organListByType: organListByType,
    certifyUser: certifyUser,
    mobileCode: mobileCode,
    traditionDetailByDeviceId: traditionDetailByDeviceId,
    traditionDetailByDeviceIdAndMaintainId: traditionDetailByDeviceIdAndMaintainId,
    addMaintainTask: addMaintainTask,
    uploadFile: uploadFile,
    addMaintainTaskForOneEquipment: addMaintainTaskForOneEquipment,
    maintainType: maintainType

}