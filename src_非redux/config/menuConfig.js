// 导航菜单配置

// title：菜单标题名称
// key：对应的path
// icon：图标名称
// children：子菜单列表

const menuList = [
    {
        title: "首页",
        key: "/home",
        icon: "HomeOutlined",
        isPublic: true
    },
    {
        title: "商品",
        key: "/products",
        icon: "ShopOutlined",
        children: [
            {
                title: "品类管理",
                key: "/category",
                icon: "HomeOutlined",
            },
            {
                title: "商品管理",
                key: "/product",
                icon: "ToolOutlined",
            },
        ]
    },
    {
        title: "用户管理",
        key: "/user",
        icon: "UserOutlined",
    },
    {
        title: "角色管理",
        key: "/role",
        icon: "SafetyOutlined",
    },
    {
        title: "图形图表",
        key: "/charts",
        icon: "AreaChartOutlined",
        children: [
            {
                title: "柱形图",
                key: "/charts/bar",
                icon: "BarChartOutlined",
            },
            {
                title: "折线图",
                key: "/charts/line",
                icon: "LineChartOutlined",
            },
            {
                title: "饼状图",
                key: "/charts/pie",
                icon: "PieChartOutlined",
            }
        ]
    }
];

export default menuList;