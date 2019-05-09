import golbal from '@/libs/global.js'

//格式化性别
export const formatSex = (row, column, cellValue, index) => {
    for(let i=0;i<golbal.Sex.length;i++){
        if(cellValue == golbal.Sex[i].value){
            return golbal.Sex[i].label;
        }
    }

};
//格式化发布状态
export  const  formatStatus =(row, column, cellValue, index) =>{
    for(let i=0;i<golbal.Status.length;i++){
        if(cellValue == golbal.Status[i].value){
            return golbal.Status[i].label;
        }
    }
};
//格式化文章状态
export  const  articleStatus =(row, column, cellValue, index) =>{
    for(let i=0;i<golbal.status.length;i++){
        if(cellValue == golbal.status[i].value){
            return golbal.status[i].label;
        }
    }
}
