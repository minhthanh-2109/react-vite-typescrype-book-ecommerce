import { updateUserAPI } from "@/services/api";
import { App, Modal, Form, Input } from "antd";
import { useEffect, useState } from "react";
interface FieldType {
    _id: string,
    email: string,
    fullName: string,
    phone: string
}
interface IProps {
    isModalUpdateOpen: boolean,
    setIsModalUpdateOpen: (v: boolean) => void
    refreshTable: () => void
    currentUserUpdate: IUserTable | null
    setCurrentUserUpdate: (v: IUserTable) => void
}
const UpdateUser = (props: IProps) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, refreshTable, currentUserUpdate, setCurrentUserUpdate } = props;
    const [form] = Form.useForm();
    const { notification, message } = App.useApp();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        if (currentUserUpdate && currentUserUpdate._id) {
            form.setFieldsValue({
                _id: currentUserUpdate._id,
                fullName: currentUserUpdate.fullName,
                email: currentUserUpdate.email,
                phone: currentUserUpdate.phone
            })
        }
    }, [currentUserUpdate])

    const onFinish = async (values: FieldType) => {
        setIsLoading(true);
        const res = await updateUserAPI(values._id, values.fullName, values.phone);
        if (res.data) {
            message.success("Update user successfully!");
        } else {
            notification.error({
                message: "Error when update user!",
                description: res.message
            });
        }
        setIsLoading(false);
        form.resetFields();
        refreshTable();
        setIsModalUpdateOpen(false);
    }

    const resetAndClosedModal = () => {
        form.resetFields();
        setIsModalUpdateOpen(false);
    }
    return (
        <div>
            <Modal
                title="Enter user information"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalUpdateOpen}
                onOk={() => { form.submit() }}
                onCancel={() => { resetAndClosedModal() }}
                maskClosable={false}
                okText={"UPDATE"}
                okButtonProps={{
                    loading: isLoading
                }}
                // loading={isLoading}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        hidden
                        label="Id"
                        name="_id"
                        rules={[
                            { required: true, message: "ID Required" }
                        ]}
                    >
                        <Input disabled placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Email Required" },
                            { type: "email", message: 'Please fill a valid email !' }
                        ]}
                    >
                        <Input disabled placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="User name"
                        name="fullName"
                        rules={[{ required: true, message: "User name required" }]}
                    >
                        <Input placeholder="Enter user name" />
                    </Form.Item>
                    <Form.Item
                        label="Phone number"
                        name="phone"
                        rules={[{ required: true, message: "Phone Required", pattern: new RegExp(/^[0-9]+$/) }]}
                    >
                        <Input placeholder="Enter phone number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
export default UpdateUser;