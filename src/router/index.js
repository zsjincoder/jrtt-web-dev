import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                // {
                //     path: '/dashboard',
                //     component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                //     meta: { title: '系统首页' }
                // },
                // {
                //     // 富文本编辑器组件
                //     path: '/editor',
                //     component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                //     meta: { title: '富文本编辑器' }
                // },
                {
                    path: '/userManagement',
                    component: resolve => require(['../views/user-management/userManagement.vue'], resolve),
                    meta: { title: '用户管理'}
                },
                {
                    path: '/roleManagement',
                    component: resolve => require(['../views/role-management/roleManagement.vue'], resolve),
                    meta: { title: '角色管理'}
                },
                {
                    path: '/menuManagement',
                    component: resolve => require(['../views/menu-management/menuManagement.vue'], resolve),
                    meta: { title: '菜单管理'}
                },
                {
                    path: '/buttonManagement',
                    component: resolve => require(['../views/button-management/buttonManagement.vue'], resolve),
                    meta: { title:'按钮管理'}
                },
                {
                    path: '/parameterManagement',
                    component: resolve => require(['../views/parameter-management/parameterManagement.vue'], resolve),
                    meta: { title:'参数管理'}
                },
                {
                    path: '/editArticles',
                    component: resolve => require(['../views/edit-articles/editArticles.vue'], resolve),
                    meta: { title:'编辑文章'}
                },
                {
                    path: '/articleManagement',
                    component: resolve => require(['../views/article-management/articleManagement.vue'], resolve),
                    meta: { title:'文章管理'}
                },
                {
                    path: '/commentModeration',
                    component: resolve => require(['../views/comment-moderation/commentModeration.vue'], resolve),
                    meta: { title:'评论审核'}
                },
                {
                    path: '/articleReview',
                    component: resolve => require(['../views/article-review/articleReview.vue'], resolve),
                    meta: { title:'文章审核'}
                },
                {
                    path: '/articleAppeals',
                    component: resolve => require(['../views/article-appeals/articleAppeals.vue'], resolve),
                    meta: { title:'文章申诉'}
                },

            ]
        },
        {
            path: '/register',
            component: resolve => require(['../components/page/register.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        },

    ]
})
