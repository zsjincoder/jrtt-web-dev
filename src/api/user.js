import axios from '../libs/api.Axios'
import {setMd5} from '@/libs/util.js'
//用户登陆
export const userLogin = (data) => {
    data.password = setMd5(data.password);
    return axios.request({
        url: '/user/Login',
        data: data,
        method: 'post'
    });
}

//用户注册
export const userRegister = (data) => {
    data.Password = setMd5(data.Password);
    return axios.request({
        url: `/user/Register`,
        data: data,
        method: 'post'
    });
}

//修改密码
export const ModifyPassWord = (data) => {
    data.Password=setMd5(data.Password);
    return axios.request({
        url: `/user/modifyUserPassword`,
        data: data,
        method: 'post'
    });
}



//参考部分，后期删除
//获取学生信息
export const GetStudentInfo = (data) => {
    return axios.request({
        url: '/student/GetStudentInfo',
        params: data,
        method: 'get'
    })
}
//获取学生成绩
export const GetStudentScroe = (data) => {
    return axios.request({
        url: '/student/GetStudentScore',
        params: data,
        method: 'get'
    })
}
//删除单个学生信息
export const DeleteStudentInfo = (data) => {
    return axios.request({
        url: '/student/DeleteStudent',
        params: data,
        method: 'get'
    })
}
//新增学生信息
export const AddStudentInfo = (data) => {
    return axios.request({
        url: '/student/AddStudents',
        data: data,
        method: 'post'
    });
}
//修改学生信息
export const ModifyStudentInfo = (data) => {
    return axios.request({
        url: '/student/UpdateStudent',
        data: data,
        method: 'post'
    });
}
