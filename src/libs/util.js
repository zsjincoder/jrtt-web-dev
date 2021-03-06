import Md5 from "js-md5"
//写入token
export const setSessionStore=(key,value)=>{
  sessionStorage.setItem(key,value);
}

//获取token
export const getSessionStore=(key)=>{
  sessionStorage.getItem(key)
}
//格式化数据
export const getFormatter=(value)=>{
    this.$golbal.Sex.filter((item,key)=>{
        if(key==value){
            return item
        }
    })
}

//md5加密密码
export const setMd5=(str)=>{
  let sort =  "kfsfoekfpfksmdlfs''']/";
  return Md5(str+sort);
}

//解析菜单列表
export const createList=(data)=>{
    let menu = [];
    for(let i =0 ;i<data.length;i++){
        let listData = {};
        let pid = "";
        if(data[i].ParentId ==="/"){
            listData = data[i];
            pid = data[i].Id;
            listData.childList = childItem(data ,pid);
            menu.push(listData);
        }
    }
    return menu
}

export const childItem= (data , pid)=>{
    let childList = [];
    for (let i =0;i<data.length;i++){
        if (data[i].ParentId === pid){
            childList.push(data[i]);
        }
    }
    return childList
}

///判断用户是否拥有按钮权限
export const judgeButtonRole=(btns,path)=>{
    let btnData =btns;
    let buttonData =JSON.parse(sessionStorage.getItem("ButtonList"));
    for(let i in btns){
        buttonData.map(item =>{
            if(item.buttonPath == path && item.buttonCode == i){
                btnData[i] = true;
            }
        })
    }
    return btnData
};
//格式化时间带t
export  const renderTime=(date)=>{
    let dateee = new Date(date).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

