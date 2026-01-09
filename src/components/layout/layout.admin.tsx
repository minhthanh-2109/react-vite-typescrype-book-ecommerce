import React, { useEffect, useState } from 'react';
import { logOutAPI } from '@/services/api';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar, App } from 'antd';
import { Outlet, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useCurrentApp } from '../context/app.context';
import type { MenuProps } from 'antd';
import AppFooter from './app.footer';
type MenuItem = Required<MenuProps>['items'][number];

const { Content, Footer, Sider } = Layout;


const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const { isAuthenticated, currentUser, setCurrentUser, setIsAuthenticated } = useCurrentApp();
    const { message } = App.useApp();
    const location = useLocation();

    useEffect(() => {
        const active: any = items.find(item => location.pathname === (item!.key as any)) ?? "/admin";
        setActiveMenu(active.key);
        // console.log(active.key)
    }, [location]);
    const handleLogout = async () => {
        const res = await logOutAPI()
        if (res.data) {
            message.success("Log out successfully!");
            localStorage.removeItem("access_token");
            setCurrentUser(null);
            setIsAuthenticated(false);
        }
    }

    const items: MenuItem[] = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: '/admin',
            icon: <AppstoreOutlined />
        },
        {
            label: <span>Manage Users</span>,
            key: '/admin/user',
            icon: <UserOutlined />,
            children: [
                {
                    label: <Link to='/admin/user'>CRUD</Link>,
                    key: '/admin/user',
                    icon: <TeamOutlined />,
                },
                // {
                //     label: 'Files1',
                //     key: 'file1',
                //     icon: <TeamOutlined />,
                // }
            ]
        },
        {
            label: <Link to='/admin/book'>Manage Books</Link>,
            key: '/admin/book',
            icon: <ExceptionOutlined />
        },
        {
            label: <Link to='/admin/order'>Manage Orders</Link>,
            key: '/admin/order',
            icon: <DollarCircleOutlined />
        },

    ];

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => alert("me")}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${currentUser?.avatar}`;

    if (isAuthenticated === false) {
        return (
            <Outlet />
        )
    }
    const isAdminRoute = location.pathname.includes("admin")
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = currentUser?.role;
        if (role === 'USER') {
            return (
                <Outlet />
            )
        }
    }
    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                        Admin
                    </div>
                    <Menu
                        // defaultSelectedKeys={[activeMenu]}
                        selectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                </Sider>
                <Layout>
                    <div className='admin-header'
                        style={{
                            height: "50px",
                            borderBottom: "1px solid #ebebeb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 15px",

                        }}>
                        <span>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </span>
                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                            <Space style={{ cursor: "pointer" }}>
                                <Avatar src={urlAvatar} />
                                {currentUser?.fullName}
                            </Space>
                        </Dropdown>
                    </div>
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    <AppFooter />
                </Layout>
            </Layout>

        </>
    );
};

export default LayoutAdmin;