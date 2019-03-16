
import axios from "../libs/api.Axios";
//得到菜单数据
export const GetMenuList = (data)=>{
    return axios.request({
        url: '/menu/queryMenuList',
        params:data,
        method: 'get'
    })
}
//新增或者修改菜单
export const  addOrModifyMenu = (data) =>{
    return axios.request({
        url:'/menu/addOrModifyMenu',
        data:data,
        method:'post'
    })
}
//获取父级菜单下拉列表数据
export  const  getParentList = (data) =>{
    return axios.request({
        url:'/menu/queryMenuSelect',
        params:data,
        method:'get'
    })
}
//删除菜单
export const deletMenu = (data) =>{
    return axios.request({
        url:`/menu/deleteMenu?id=${data}`,
        method:'delete' ,
    })
}
