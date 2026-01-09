import { useCurrentApp } from "@/components/context/app.context";
import { changePasswordAPI } from "@/services/api";
import { App, Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import "styles/change.password.scss"
interface FieldType {
    email: string,
    oldPassword: string,
    newPassword: string
}
const ChangePassword = () => {
    const [form] = useForm();
    const { currentUser } = useCurrentApp();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { message, notification } = App.useApp();
    useEffect(() => {
        if (currentUser) {
            form.setFieldValue('email', currentUser.email);
        }
    }, [currentUser])
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true);
        const { email, oldPassword, newPassword } = values;
        const res = await changePasswordAPI(email, oldPassword, newPassword);
        if (res && res.data) {
            message.success("Update password successfully!");
            form.setFieldValue("oldPassword", "");
            form.setFieldValue("newPassword", "");
        } else {
            notification.error({
                message: "Change password failed",
                description: res.message
            })
        }

        setIsLoading(false);
        // console.log('Success:', values);
    };
    return (
        <div className="change-password-tab" style={{ minHeight: 400 }}>
            <Row>
                <Col span={1}></Col>
                <Col span={12}>
                    <Form
                        onFinish={onFinish}
                        name="Change password"
                        form={form}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Email"
                            labelCol={{ span: 24 }}
                            name="email"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Old password"
                            labelCol={{ span: 24 }}
                            name="oldPassword"
                            rules={[{ required: true, message: "Old password required" }]}
                        >
                            <Input.Password placeholder="Enter your old password" />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="New password"
                            labelCol={{ span: 24 }}
                            name="newPassword"
                            rules={[{ required: true, message: "New password required" }]}
                        >
                            <Input.Password placeholder="Enter your new password" />
                        </Form.Item>
                        <Button loading={isLoading} htmlType="submit" variant="solid" color="primary">Update password</Button>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}
export default ChangePassword