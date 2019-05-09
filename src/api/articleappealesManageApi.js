import axios from "../libs/api.Axios";
export  const  GetAppealInfo = (data,userId,queryKey)=>{
    return axios.request({
        url:`/appeal/queryAppealInfo`,
        params:data,
        method:'get'
    })
}

export  const  DealAppealInfo = (data)=>{
    return axios.request({
        url:`/appeal/dealWithAppeal`,
        params:data,
        method:'get'
    })
}
export  const  QueryAppeal = (data)=>{
    return axios.request({
        url:`/appeal/queryAppealById`,
        params:data,
        method:'get'
    })
}
export  const handlerAppeal = (data)=>{
    return axios.request({
        url:`/appeal/handlerAppeal`,
        data:data,
        method:'post'
    })
}
export  const deleteAppeal = (data)=>{
    return axios.request({
        url:`/appeal/deleteAppealById`,
        params:data,
        method:'delete'
    })
}

