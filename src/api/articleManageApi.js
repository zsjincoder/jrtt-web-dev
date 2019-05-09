import axios from "../libs/api.Axios";
export  const  GetArticleList = (data,userId,queryKey)=>{
    return axios.request({
        url:`/article/getAllArticles?userId=${userId}&keywordName=${queryKey}`,
        params:data,
        method:'get'
    })
}

export  const  DeleteArticle = (info)=>{
    return axios.request({
        url:`/article/deleteArticle?articleId=${info}`,
        data:data,
        method:"delete"
    })
}

export  const  GetReportingInformation = (data)=>{
    return axios.request({
        url:`/inform/queryInformInfoForArticleId`,
        params:data,
        method:"get"
    })
}
export  const  AddComplaintInformation = (data)=>{
    return axios.request({
        url:`/appeal/addAppealInfo`,
        data:data,
        method:"post"
    })
}

export  const  GetAppealInfo = (data)=>{
    return axios.request({
        url:`/appeal/queryAppealInfoForArticleId`,
        params:data,
        method:"get"
    })
}

