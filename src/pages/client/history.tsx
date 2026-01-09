import { getOrderHistoryAPI } from "@/services/api";
import { FORMATE_DATE_VN } from "@/services/helper";
import { App, Drawer, Table, Tag } from "antd";
import { TableProps } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const History = () => {
    const [dataHistory, setDataHistory] = useState<IHistory[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IHistory | null>(null);
    const { notification } = App.useApp();
    useEffect(() => {
        getOrderHistory();
    }, []);
    const onClose = () => {
        setDataDetail(null);
        setIsDrawerOpen(false);
    };

    const getOrderHistory = async () => {
        setIsLoading(true);
        const res = await getOrderHistoryAPI();
        if (res && res.data) {
            // console.log(res.data);
            setDataHistory(res.data);
        } else {
            notification.error({
                message: "Error when getting order history",
                description: res.message
            });
        }
        setIsLoading(false);
    }

    const columns: TableProps<IHistory>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (item, record, index) => (<>{index + 1}</>)
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            render: (item, record, index) => {
                return dayjs(item).format(FORMATE_DATE_VN);
            },
        },
        {
            title: 'Total',
            dataIndex: 'totalPrice',
            render: (item, record, index) => {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item ?? 0);
            },
        },
        {
            title: 'Status',
            render: (item, record, index) => (
                <Tag color="green">
                    Success
                </Tag>
            )
        },
        {
            title: 'Detail',
            key: 'action',
            render: (_, record) => (
                <a href="#" onClick={() => { setIsDrawerOpen(true); setDataDetail(record); }
                } > View detail</a >
            )
        }
    ];
    return (
        <>
            <div style={{ background: '#efefef', padding: '20px 0' }}>
                <div className="order-history-container" style={{ maxWidth: 1600, margin: '0 auto' }}>
                    <div className="title">Order history</div>
                    <Table
                        loading={isLoading}
                        bordered
                        rowKey={"_id"}
                        dataSource={dataHistory}
                        columns={columns} />
                </div>
            </div >
            <Drawer
                title="Order detail"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={isDrawerOpen}
            >
                {dataDetail?.detail.map((item, index) => {
                    return (
                        <ul key={index}>
                            <li>
                                Book: {item.bookName}
                            </li>
                            <li>
                                Quantity: {item.quantity}
                            </li>
                        </ul>
                    )
                })}
            </Drawer>
        </>

    );
}
export default History;