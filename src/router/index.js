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
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    path: '/showStudent',
                    component: resolve => require(['../views/show-student/showStudent.vue'], resolve),
                    meta: { title: '学生信息展示', permission: true }
                },
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
                }

            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
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
