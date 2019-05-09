<template>
    <div>
        <Modal
            v-model="isConfig1"
            :closable="false"
            :mask-closable="false"
            width="1200">
                <Card>
                    <p style="text-align: center" slot="title">{{articleData.Title}}
                    <p style="text-align: right">点赞数：{{articleData.ThumbNum}}转发：{{articleData.ForwardingNum}}</p></p>
                    <p v-html="articleData.Content"></p>
                    <p></p>
                    <p></p>
                </Card>
                <div slot="footer">
                    <Button style="margin-left: 8px" @click="_close()">关闭</Button>
                </div>
        </Modal>
    </div>
</template>

<script>
    import {GetArticle} from "@/api/editarticlesManageApi.js"

    export default {
        name: "previewArticle",
        props: {articleId: String, isConfig1: Boolean},
        data() {
            return {
                articleData: {},
            }
        },
        methods: {
            getArticle() {
                GetArticle({articleId: this.articleId}).then(res => {
                    if (res.data.code == 0) {
                        this.articleData = res.data.data;
                    }
                })
            },
            _close() {
                this.$emit('closeUpdata')
            }

        },
        created() {
            this.getArticle();
        }
    }
</script>

<style scoped>

</style>
