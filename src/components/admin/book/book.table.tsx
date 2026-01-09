import { deleteBookAPI, deleteUserAPI, getBookAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, PlusOutlined, ExportOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';
import BookDetail from './book.detail';
import AddNewBook from './add.new.book';
import UpdateBook from './update.book';

type TSearch = {
    mainText: string,
    author: string,
    price: number,
    category: string,
    createdAtRange: string
    updatedAt: string
}
const TableBook = () => {
    const actionRef = useRef<ActionType>();
    const [bookDetail, setBookDetail] = useState<IBookTable | null>(null);
    const [currentBookList, setCurrentBookList] = useState<IBookTable[]>([]);
    const [currentBookUpdate, setCurrentBookUpdate] = useState<IBookTable | null>(null);
    const { notification } = App.useApp();
    const [meta, setMeta] = useState(
        {
            current: 1,
            pageSize: 5,
            pages: 0,
            total: 0
        }
    );
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false)
    const [isModalAddOpen, setIsModalAddOpen] = useState<boolean>(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [messageApi, holder] = message.useMessage()

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        // console.log(e);
        messageApi.error('Delete cancel');
    };
    const handleDeleteBook = async (_id: string) => {
        setIsLoading(true);
        const res = await deleteBookAPI(_id);
        if (res.data) {
            messageApi.success("Delete book successfully")
        } else {
            notification.error({
                message: "Error when delete book",
                description: res.message,
            });
        }
        setIsLoading(false);
        refreshTable();
    }
    const columns: ProColumns<IBookTable>[] = [
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
                        <a href='#' onClick={() => {
                            setIsDrawerOpen(true);
                            setBookDetail(entity);
                        }}>{entity._id}</a>
                    </div>

                )
            }

        },
        {
            title: 'Title',
            dataIndex: 'mainText',

        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: true


        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.price)}
                    </>
                )
            },
        },
        {
            title: 'Category',
            dataIndex: 'category',
            hideInSearch: true
        },
        {
            title: 'Updated at',
            dataIndex: 'updatedAt',
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
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            onClick={() => { setIsModalUpdateOpen(true); setCurrentBookUpdate(entity); console.log(currentBookUpdate) }}
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                        />
                        {holder}
                        <Popconfirm
                            title="Delete the user"
                            description="Are you sure to delete this book?"
                            onConfirm={() => handleDeleteBook(entity._id)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={
                                { loading: isLoading }
                            }
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{ cursor: "pointer" }}
                            />
                        </Popconfirm >
                    </>
                );
            },

        },
    ];
    const refreshTable = () => {
        actionRef.current?.reload();
    }
    return (
        <>
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    // console.log(sort.createdAt)
                    // console.log(params, sort, filter);
                    // console.log(params.current, params.pageSize)
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.author) {
                            query += `&author=/${params.author}/i`
                        }
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.price) {
                            query += `&price=/${params.price}/i`
                        }
                        if (params.category) {
                            query += `&category=/${params.category}/i`
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                        //default
                        let sortQuery = '&sort=-createdAt'
                        if (sort) {
                            if (sort.createdAt) {
                                sortQuery = `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                            }
                            if (sort.quantity) {
                                sortQuery = `&sort=${sort.quantity === "ascend" ? "quantity" : "-quantity"}`
                            }
                            if (sort.price) {
                                sortQuery = `&sort=${sort.quantity === "ascend" ? "price" : "-price"}`
                            }
                            if (sort.author) {
                                sortQuery = `&sort=${sort.quantity === "ascend" ? "author" : "-author"}`
                            }
                        }
                        query += sortQuery;
                    }
                    const res = await getBookAPI(query);
                    if (res.data) {
                        // console.log(query)
                        setMeta(res.data?.meta);
                        setCurrentBookList(res.data.result ?? [])
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
                headerTitle="Table user"
                toolBarRender={() => [
                    <CSVLink
                        data={currentBookList}
                        filename='export-book.csv'>
                        <Button
                            key="button"
                            icon={<ExportOutlined />}
                            type="primary"
                        > Export</Button>
                    </CSVLink>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalAddOpen(true)
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />
            <BookDetail
                bookDetail={bookDetail}
                setIsDrawerOpen={setIsDrawerOpen}
                isDrawerOpen={isDrawerOpen}
                setBookDetail={setBookDetail}
            ></BookDetail >
            <AddNewBook
                refreshTable={refreshTable}
                isModalAddOpen={isModalAddOpen}
                setIsModalAddOpen={setIsModalAddOpen}
            ></AddNewBook>
            <UpdateBook
                currentBookUpdate={currentBookUpdate}
                setCurrentBookUpdate={setCurrentBookUpdate}
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                refreshTable={refreshTable}
            ></UpdateBook>
        </>
    );
};

export default TableBook;