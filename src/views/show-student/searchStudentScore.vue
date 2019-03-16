<template>
    <div>
        <Modal
            v-model="controllModal1"
            title="成绩查询"
            :closable="false"
            :mask-closable="false">
            <Table border :columns="columns1" :data="tableData"></Table>
            <div slot="footer">
                <Button style="margin-left: 8px" @click="cancel">关闭</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import {GetStudentScroe} from "@/api/user.js"

    export default {
        name: "searchStudentScore",
        props: {controllModal1: Boolean, id: String},
        data() {
            return {
                modal1: false,
                tableData: [],
                columns1: [
                    {
                        title: "科目",
                        key: 'CName'
                    },
                    {
                        title: "成绩",
                        key: 'Grade'
                    }
                ]
            }
        },
        methods: {
            cancel() {
                this.$emit('closesModel1')
            },
            getTableData() {
                let dataId = {
                    studentId: this.$props.id
                };
                GetStudentScroe(dataId).then(response => {
                    console.log(response);
                    if (response.data.code == 0) {
                        if (response.data.data.scoreData === null) {
                            this.tableData = []
                        } else {
                            this.tableData = response.data.data.scoreData;
                        }
                    }
                })
            }
        },
        created() {
            this.getTableData();
        },
        mounted() {

        },
        beforeCreate() {

        },
        beforeMount() {
        }

    }
</script>

<style scoped>

</style>
