import axios from "../libs/api.Axios";
//获取参数列表数据
export const  GetParamList = (data)=>{
    return axios.request({
        url:'/param/queryParamList',
        params:data,
        method:'get'
    })
}
//新增或修改参数信息保存接口
export  const AddOrModifyParam = (data)=>{
    return axios.request({
        url:'/param/addOrModifyParam',
        data:data,
        method:'post'
    })
}
//选择父级参数下拉列表数据
export  const QueryParamSelect =(data)=>{
    return axios.request({
        url:"/param/queryParamSelect",
        params:data,
        method:'get'
    })
}
//删除接口
export const  DeleteParam =(data)=>{
    return axios.request({
        url:"/param/deleteParam",
        params:data,
        method:'delete'
    })
}




