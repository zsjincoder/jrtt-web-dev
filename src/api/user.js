import axios from '../libs/api.Axios'
//用户登陆
export const userLogin = (data)=>{
  return axios.request({
    url: '/login',
    data:data,
    method: 'post'
  });
}

//用户注册
export const userRegister = (data)=>{
  return axios.request({
    url: '/user/Register',
    data:data,
    method: 'post'
  });
}

//获取学生信息
export const GetStudentInfo = (data)=>{
    return axios.request({
        url: '/student/GetStudentInfo',
        params:data,
        method: 'get'
    })
}


export const modifyUserInfo = (data,pageData)=>{
    return axios.request({
        url: `/user/modifyUserInfo?pageSize=${pageData.pageSize}&pageNum=${pageData.pageNum}&total=${pageData.total}`,
        method: 'post',
        data:data,
        headers:{'Content-Type': 'multipart/form-data'}
    })
}
