import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import News from '@/views/news/News.vue'
import TrueFalse from '@/views/nav2/TrueFalse.vue'
import SimpleChoice from '@/views/nav2/SimpleChoice.vue'
import MultipleChoice from '@/views/nav2/MultipleChoice.vue'
import Exam from '@/views/nav3/Exam.vue'
import Unit from '@/views/user/Unit.vue'
import User from '@/views/user/User.vue'
import Banner from '@/views/app/Banner.vue'
import Law from '@/views/app/Law.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '课程管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: '课程管理' },
//            { path: '/form', component: Form, name: 'Form' },
//            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '试题管理',
        iconCls: 'el-icon-question',
        children: [
            // { path: '/page4', component: Page4, name: '页面4' },
            // { path: '/page5', component: Page5, name: '页面5' },
            { path: '/trueFalse', component: TrueFalse, name: '判断题管理' },
            { path: '/simpleChoice', component: SimpleChoice, name: '单选题管理' },
            { path: '/multipleChoice', component: MultipleChoice, name: '多选题管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '考试管理',
        iconCls: 'el-icon-document',
//        leaf: true,//只有一个节点
        children: [
 //           { path: '/page6', component: Page6, name: '考试管理' },
            { path: '/exam', component: Exam, name: '考试管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '新闻管理',
        iconCls: 'el-icon-news',
        children: [
            { path: '/news', component: News, name: '新闻管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '单位管理',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/unit', component: Unit, name: '单位管理' },
            { path: '/user', component: User, name: '用户管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'APP管理',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/banner', component: Banner, name: 'Banner管理' },
            { path: '/law', component: Law, name: '法律法规管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '统计分析',
        iconCls: 'el-icon-picture',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },

    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;