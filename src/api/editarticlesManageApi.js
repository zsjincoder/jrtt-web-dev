import axios from "../libs/api.Axios";
//新增修改文章接口
export const  AddOrModifyMarkDown = (data)=>{
    return axios.request({
        url:'/article/addOrModifyMarkDown',
        data:data,
        method:'post'
    })
}
//获取文章分类和频道下拉列表
export  const GetClassifyAndChannel = (data)=>{
    return axios.request({
        url:`/param/queryParamSelectForCode`,
        params:data,
        method:'get'
    })
};
//单独获取一篇文章
export  const GetArticle =(data) =>{
    return axios.request({
        url:"/article/getOneArticle",
        params:data,
        method:'get'
    })
};
export  const  SaveArticle = (data)=>{
    return axios.request({
        url:"/article/addOrModifyMarkDown",
        data:data,
        method:'post'
    })
};

