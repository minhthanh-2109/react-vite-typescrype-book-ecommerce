import { getListOrderAPI } from '@/services/api';
import { ExportOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';

type TSearch = {
    name: string,
    address: string,
}
const OrderTable = () => {
    const actionRef = useRef<ActionType>();
    const [currentOrderList, setCurrentOrderList] = useState<IOrderTable[]>([]);
    const [meta, setMeta] = useState(
        {
            current: 1,
            pageSize: 5,
            pages: 0,
            total: 0
        }
    );

    const columns: ProColumns<IOrderTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render: (dom, entity, index, action, schema) => {
                return (
                    <div>
                        <a href='#'>{entity._id}</a>
                    </div>
                )
            }

        },
        {
            title: 'Full name',
            dataIndex: 'name',

        },
        {
            title: 'Address',
            dataIndex: 'address',

        },
        {
            title: 'Price',
            dataIndex: 'price',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.totalPrice)}
                    </>
                )
            },
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            valueType: 'date',
            hideInSearch: true,
            sorter: true,
            render(dom, entity, index, action, schema) {
                return (
                    <div>
                        {dayjs(entity.createdAt).format("DD-MM-YYYY")}
                    </div>
                );
            },
            // sortOrder: 'descend'
        },
        {
            title: 'Created at',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
            hideInSearch: true
        },
    ];
    return (
        <>
            <ProTable<IOrderTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.name) {
                            query += `&name=/${params.name}/i`
                        }
                        if (params.address) {
                            query += `&address=/${params.address}/i`
                        }
                        //default
                        let sortQuery = '&sort=-createdAt'
                        if (sort) {
                            if (sort.createdAt) {
                                sortQuery = `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                            }
                        }
                        query += sortQuery;
                    }
                    const res = await getListOrderAPI(query);
                    if (res.data) {
                        // console.log(query)
                        setMeta(res.data?.meta);
                        setCurrentOrderList(res.data.result ?? [])
                        // console.log(res.data.result);
                    }
                    // const data = await (await fetch('https://proapi.azurewebsites.net/github/issues')).json()
                    return {
                        // data: data.data,
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }
                }
                editable={{
                    type: 'multiple',
                }}
                columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                    defaultValue: {
                        option: { fixed: 'right', disable: true },
                    },
                    onChange(value) {
                        //console.log('value: ', value);
                    },
                }}
                rowKey="_id"
                form={{
                    syncToUrl: (values, type) => {
                        if (type === 'get') {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime],
                            };
                        }
                        return values;
                    },
                }}
                pagination={{
                    pageSize: meta.pageSize,
                    current: meta.current,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} out of {total}</div>) }
                }}
                headerTitle="Table order"
                toolBarRender={() => [
                    <CSVLink
                        data={currentOrderList}
                        filename='export-order.csv'>
                        <Button
                            key="button"
                            icon={<ExportOutlined />}
                            type="primary"
                        > Export</Button>
                    </CSVLink>,
                ]}
            />
        </>
    );
};

export default OrderTable;