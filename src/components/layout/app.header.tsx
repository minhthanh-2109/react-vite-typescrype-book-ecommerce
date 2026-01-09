import { useState } from 'react';
import { FaReact } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, Avatar, Popover, App, Empty } from 'antd';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import './app.header.scss';
import { Link } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { logOutAPI } from '@/services/api';
import 'styles/global.scss'
import ManageAccount from '../client/account/account.manage';
const AppHeader = (props: any) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const { message } = App.useApp();
    const { isAuthenticated, currentUser, setCurrentUser, setIsAuthenticated, carts } = useCurrentApp();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const { searchItem, setSearchItem } = props;

    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await logOutAPI()
        if (res.data) {
            message.success("Log out successfully!");
            localStorage.removeItem("access_token");
            setCurrentUser(null);
            setIsAuthenticated(false);
        }
    }

    const items = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => setIsModalOpen(true)}
            >Account Management</label>,
            key: 'account',
        },
        {
            label: <Link to="/history">History</Link>,
            key: 'history',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Log out</label>,
            key: 'logout',
        },

    ];
    if (currentUser?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Admin Page</Link>,
            key: 'admin',
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${currentUser?.avatar}`;
    // console.log("Item on carts:", carts)
    const contentPopover = () => {
        return (
            <div className='pop-cart-body'>
                <div className='pop-cart-content'>
                    {carts?.map((book, index) => {
                        return (
                            <div className='book' key={`book-${index}`}>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.bookDetail?.thumbnail}`} />
                                <div>{book?.bookDetail?.mainText}</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.bookDetail?.price ?? 0)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {carts.length > 0 ?
                    <div className='pop-cart-footer'>
                        <button className='view-order-btn' onClick={() => navigate('/order')}>View your cart</button>
                    </div>
                    :
                    <Empty
                        description="No item"
                    />
                }
            </div>
        )
    }
    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo'>
                                <span onClick={() => navigate('/')}> <FaReact className='rotate icon-react' />minh_thanh</span>

                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            <input
                                className="input-search" type={'text'}
                                placeholder="Search"
                                value={searchItem}
                                onChange={(e) => { setSearchItem(e.target.value); console.log(searchItem) }}
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    className="popover-carts"
                                    placement="topRight"
                                    rootClassName="popover-carts"
                                    title={"Added items"}
                                    content={contentPopover}
                                    arrow={true}>
                                    <Badge
                                        count={carts?.length ?? 0}
                                        // count={10}
                                        size={"small"}
                                        showZero
                                    >
                                        <FiShoppingCart className='icon-cart' />
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> Account</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <Space >
                                            <Avatar src={urlAvatar} />
                                            {currentUser?.fullName}
                                        </Space>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p onClick={() => { setIsModalOpen(true); setOpenDrawer(false) }}>Account Management</p>
                <Divider />

                <p onClick={() => { handleLogout() }}>Đăng xuất</p>
                <Divider />
            </Drawer>


            <ManageAccount
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            ></ManageAccount>

        </>
    )
};

export default AppHeader;
