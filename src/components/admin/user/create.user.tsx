import { createUserAPI } from "@/services/api";
import { Modal, Form, Input, App } from "antd";
import { FormProps } from "antd/lib";
import { useState } from "react";
type FieldType = {
    fullname: string;
    password: string;
    email: string;
    phone: string;

};
interface IProps {
    isModalOpen: boolean,
    setIsModalOpen: (v: boolean) => void
    refreshTable: () => void
}
const CreateUserModal = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, refreshTable } = props;
    const [form] = Form.useForm();
    const { notification, message } = App.useApp();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        // console.log('Success:', values);
        setIsLoading(true);
        const res = await createUserAPI(values.fullname, values.password, values.email, values.phone);
        if (res.data) {
            message.success("Create user successfully!");
            form.resetFields();
            setIsModalOpen(false);
            refreshTable();
        } else {
            notification.error({
                message: 'Error when create user',
                description: res.message
            })
        }
        setIsLoading(false);
    };

    const resetAndClosedModal = () => {
        form.resetFields();
        setIsModalOpen(false);
    }
    return (
        <div className='user-form' style={{ margin: "20px 0" }}>
            <Modal
                title="Enter user information"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={() => { form.submit() }}
                onCancel={() => { resetAndClosedModal() }}
                maskClosable={false}
                okText={"CREATE"}
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
                    <Form.Item<FieldType>
                        label="User name"
                        name="fullname"
                        rules={[{ required: true, message: "User name required" }]}
                    >
                        <Input placeholder="Enter user name" />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Password Required" }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Email Required" },
                            { type: "email", message: 'Please fill a valid email !' }
                        ]}
                    >
                        <Input placeholder="Enter email" />
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
export default CreateUserModal;