import golbal from '@/libs/global.js'

//格式化性别
export const formatSex = (row, column, cellValue, index) => {
    for(let i=0;i<golbal.Sex.length;i++){
        if(cellValue == golbal.Sex[i].value){
            return golbal.Sex[i].label;
        }
    }

}
