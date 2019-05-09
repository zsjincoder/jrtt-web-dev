import axios from '../libs/api.Axios'
//管理系统模块儿
//1.用户管理
//得到用户数据
export const GetUserList = (data)=>{
    return axios.request({
        url: '/user/userList',
        params:data,
        method: 'get'
    })
}
//修改用户信息
export const ModifyUserInfo = (data)=>{
    return axios.request({
        url: '/user/modifyUserInfo',
        data:data,
        method: 'post',
        headers:{'Content-Type': 'multipart/form-data'}
    })
}
//删除普通用户和取消管理员用户
export const DeleteUser = (data)=>{
    return axios.request({
        url: '/user/DeleteUser',
        data:data,
        method: 'delete',
    })
}
//设置普通用户为管理员用户
export const SetAdmin = (data)=>{
    return axios.request({
        url: '/user/appointAdmin',
        params:data,
        method: 'get',
    })
}
//禁用用户
export const  ChangeStatus=(data)=>{
    return axios.request({
        url:'/user/changeUserStatus',
        params:data,
        method:'get',
    })
}

