import {
    ToolOutlined,
    UnorderedListOutlined,
    HomeOutlined,
    AppstoreOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    AreaChartOutlined,
    PieChartOutlined,
    LineChartOutlined,
    BarChartOutlined
} from '@ant-design/icons';

const menuList = [
    {
        title: '首页', // 菜单标题名称
        key: '/home', // 对应的 path
        icon: <HomeOutlined/>, // 图标名称
    },
    {
        title: '商品',
        key: '/categories',
        icon: <AppstoreOutlined/>,
        children: [ // 子菜单列表
            {
                title: '品类管理', // 菜单标题名称
                key: '/category', // 对应的 path
                icon: <UnorderedListOutlined/>, // 图标名称
            },
            {
                title: '商品管理', // 菜单标题名称
                key: '/product', // 对应的 path
                icon: <ToolOutlined/>, // 图标名称
            }
        ]
    },
    {
        title: '用户管理', // 菜单标题名称
        key: '/user', // 对应的 path
        icon: <UserOutlined/>, // 图标名称
    },
    {
        title: '角色管理', // 菜单标题名称
        key: '/role', // 对应的 path
        icon: <SafetyCertificateOutlined/>, // 图标名称
    },
    {
        title: '图表界面',
        key: '/charts',
        icon: <AreaChartOutlined/>,
        children: [ // 子菜单列表
            {
                title: '条形图', // 菜单标题名称
                key: '/charts/bar', // 对应的 path
                icon: <BarChartOutlined/>, // 图标名称
            },
            {
                title: '比例图', // 菜单标题名称
                key: '/charts/pie', // 对应的 path
                icon: <PieChartOutlined/>, // 图标名称
            },
            {
                title: '折线图', // 菜单标题名称
                key: '/charts/line', // 对应的 path
                icon: <LineChartOutlined/>, // 图标名称
            }
        ]
    },
]

export default menuList;