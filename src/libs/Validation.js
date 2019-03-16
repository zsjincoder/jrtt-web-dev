//验证手机号码
export const validatePhoneNum = (rule, value, callback) => {
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (value === '' || value === undefined) {
        callback(new Error('请输入手机号码'));
    } else if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码'));
    } else {
        callback();
    }
};
//验证日期格式
export const validateBrithday = (rule, value, callback) => {
    let myDate = new Date();
    let brithDay = new Date(Date.parse(value));
    if (brithDay > myDate) {
        callback(new Error('请选择正确的出生日期'));
    } else {
        callback();
    }
};
//验证密码位数
export const validatePassWord = (rule, value, callback) => {
    if (value === '' || value === undefined) {
        callback(new Error('请输入密码'));
    } else if (value.length>16) {
        callback(new Error('密码位数超出16位'));
    } else {
        callback();
    }
};
