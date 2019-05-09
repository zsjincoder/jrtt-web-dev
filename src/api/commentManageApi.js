import axios from "../libs/api.Axios";
export  const  GetComment = (data)=>{
    return axios.request({
        url:`/inform/queryInformInfo`,
        params:data,
        method:'get'
    })
};

export  const  GetOneComment = (data)=>{
    return axios.request({
        url:"/inform/queryOneInformInfo",
        params:data,
        method:'get'
    })
};
export  const  DealComment = (data)=>{
    return axios.request({
        url: "/inform/dealWithInform",
        params:data,
        method:'get'
    })
};

export  const  SaveComment = (data)=>{
    return axios.request({
        url: "/inform/handlerInform",
        data:data,
        method:'post'
    })
};
export  const  DeleteComment = (data)=>{
    return axios.request({
        url: "/inform/deleteInformById",
        params:data,
        method:'delete'
    })
};
