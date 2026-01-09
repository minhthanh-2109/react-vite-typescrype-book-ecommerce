import { deleteUserAPI, getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, PlusOutlined, CloudUploadOutlined, ExportOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, message, notification } from 'antd';
import { useRef, useState } from 'react';
import UserDetail from 'components/admin/user/user.detail';
import CreateUserModal from 'components/admin/user/create.user';
import ImportUser from 'components/admin/user/import.user';
import { CSVLink } from 'react-csv';
import UpdateUser from 'components/admin/user/update.user';
import dayjs from 'dayjs';

type TSearch = {
    fullName: string,
    email: string,
    createdAt: string,
    createdAtRange: string
}
const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [userDetail, setUserDetail] = useState<IUserTable | null>(null);
    const [currentUserList, setCurrentUserList] = useState<IUserTable[]>([]);
    const [currentUserUpdate, setCurrentUserUpdate] = useState<IUserTable | null>(null);
    const { notification } = App.useApp();
    const [meta, setMeta] = useState(
        {
            current: 1,
            pageSize: 5,
            pages: 0,
            total: 0
        }
    );

    const [isModalImportOpen, setIsModalImportOpen] = useState<boolean>(false)
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [messageApi, holder] = message.useMessage()

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
        messageApi.error('Delete cancel');
    };
    const handleDeleteUser = async (_id: string) => {
        setIsLoading(true);
        const res = await deleteUserAPI(_id);
        if (res.data) {
            messageApi.success("Delete user successfully")
        } else {
            notification.error({
                message: "Error when delete user",
                description: res.message,
            });
        }
        setIsLoading(false);
        refreshTable();
    }
    const columns: ProColumns<IUserTable>[] = [
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
                            setUserDetail(entity);
                        }}>{entity._id}</a>
                    </div>

                )
            }

        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',

        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,

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
            hideInTable: true
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            onClick={() => { setIsModalUpdateOpen(true); setCurrentUserUpdate(entity); console.log(currentUserUpdate) }}
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                        />
                        {holder}
                        <Popconfirm
                            title="Delete the user"
                            description="Are you sure to delete this user?"
                            onConfirm={() => handleDeleteUser(entity._id)}
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
            <ProTable<IUserTable, TSearch>
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
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                        //default
                        let sortQuery = '&sort=-createdAt'
                        if (sort && sort.createdAt) {

                            sortQuery = `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                        }
                        query += sortQuery;
                    }
                    const res = await getUsersAPI(query);
                    if (res.data) {
                        // console.log(query)
                        setMeta(res.data?.meta);
                        setCurrentUserList(res.data.result ?? [])
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
                        // console.log('value: ', value);
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
                    <Button
                        key="button"
                        icon={<ExportOutlined />}
                        type="primary"
                    >
                        <CSVLink data={currentUserList} filename='export-user.csv'> Export user</CSVLink>
                    </Button>,
                    <Button
                        key="button"
                        icon={<CloudUploadOutlined />}
                        onClick={() => {
                            setIsModalImportOpen(true)
                        }}
                        type="primary"
                    >
                        Import user
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalOpen(true)
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />
            <UserDetail
                userDetail={userDetail}
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                setUserDetail={setUserDetail}>
            </UserDetail>
            <CreateUserModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                refreshTable={refreshTable}
            >
            </CreateUserModal>
            <ImportUser
                isModalImportOpen={isModalImportOpen}
                setIsModalImportOpen={setIsModalImportOpen}
                refreshTable={refreshTable}
            ></ImportUser>
            <UpdateUser
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                refreshTable={refreshTable}
                currentUserUpdate={currentUserUpdate}
                setCurrentUserUpdate={setCurrentUserUpdate}
            ></UpdateUser>
        </>
    );
};

export default TableUser;