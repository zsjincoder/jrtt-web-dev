
import axios from "../libs/api.Axios";
//得到角色数据
export const GetRoleList = (data)=>{
    return axios.request({
        url: '/user/roleList',
        params:data,
        method: 'get'
    })
}
//新增或者修改用户信息
export const ModifyRoleInfo = (data)=>{
    return axios.request({
        url: '/user/addOrModifyRole',
        data:data,
        method: 'post',
    })
}
//删除角色
export const DeleteRole = (data)=>{
    return axios.request({
        url: '/user/DeleteRole',
        data:data,
        method: 'delete',
    })
}
//得到用户拥有的角色
export const GetUserRoleList = (data)=>{
    return axios.request({
        url: '/user/queryUserRole',
        params:data,
        method: 'get'
    })
}
//保存用户选定角色
export const SaveUserRole= (data)=>{
    return axios.request({
        url: '/user/saveUserRoles',
        data:data,
        method: 'post'
    })
}


