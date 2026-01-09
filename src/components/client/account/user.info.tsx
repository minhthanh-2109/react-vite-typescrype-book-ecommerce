import { useCurrentApp } from "@/components/context/app.context";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Avatar, Button, Col, Form, Input, Upload, UploadFile, UploadProps } from "antd";
import { useForm } from "antd/es/form/Form";
import { FormProps, Row } from "antd/lib";
import { useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { callUploadBookImgAPI, updateUserInfoAPI } from "@/services/api";
import "styles/user.info.scss"
interface FieldType {
    _id: string,
    email: string,
    phone: string,
    fullName: string
}

const UserInfo = () => {
    const { currentUser, setCurrentUser } = useCurrentApp();
    const { message } = App.useApp();
    const [userAvatar, setUserAvatar] = useState<string>(currentUser?.avatar ?? "");
    const avatarUrl = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar}`
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = useForm();

    useEffect(() => {
        if (currentUser) {
            form.setFieldsValue(
                {
                    _id: currentUser.id,
                    fullName: currentUser.fullName,
                    email: currentUser.email,
                    phone: currentUser.phone
                }
            );
        }
    }, [currentUser])
    const handleUploadFile = async (options: RcCustomRequestOptions) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await callUploadBookImgAPI(file, 'avatar');
        if (res && res.data) {
            const newAvatarUrl = res.data.fileUploaded;
            setUserAvatar(newAvatarUrl);
            if (onSuccess) {
                onSuccess('Ok');
            }
        } else {
            message.error(res.message);
        }
    }

    const propsUpload: UploadProps = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadFile,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true);
        const { _id, fullName, phone } = values;
        const res = await updateUserInfoAPI(_id, fullName, phone, userAvatar);
        if (res && res.data) {
            setCurrentUser(
                {
                    ...currentUser!,
                    avatar: userAvatar,
                    fullName,
                    phone
                }
            );
            message.success("Update user successfully!");
            //force renew token
            localStorage.removeItem("access_token");

        } else {
            message.error("Update user failed!")
        }

        setIsLoading(false);
        // console.log('Success:', values);
    };
    return (
        <div className="user-info-modal" style={{ minHeight: 400 }}>
            <Row>
                <Col sm={24} md={12} className="avatar-section">
                    <Row gutter={[48, 24]}>
                        <Col span={24}>
                            <Avatar
                                size={{
                                    xs: 40,   // mobile nhỏ
                                    sm: 64,   // mobile lớn
                                    md: 96,   // tablet
                                    lg: 128,  // desktop
                                    xl: 160,  // desktop lớn
                                    xxl: 200, // màn hình rất lớn
                                }}
                                icon={< AntDesignOutlined />}
                                shape="circle"
                                src={avatarUrl}
                            >
                            </Avatar>
                        </Col>
                        <Col span={24}>
                            <Upload {...propsUpload}>
                                <Button icon={<UploadOutlined />}>
                                    Upload Avatar
                                </Button>

                            </Upload>
                        </Col>
                    </Row>
                </Col>

                <Col sm={24} md={12} className="form-section">
                    <Form
                        form={form}
                        onFinish={onFinish}
                        name="User information"
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="_id"
                            labelCol={{ span: 24 }}
                            name="_id"
                            hidden
                        >
                            <Input disabled hidden />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Full Name"
                            labelCol={{ span: 24 }}
                            name="fullName"
                            rules={[{ required: true, message: "Fullname Required" }]}
                        >
                            <Input placeholder="Enter full name"></Input>
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Email"
                            labelCol={{ span: 24 }}
                            name="email"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Phone Number"
                            labelCol={{ span: 24 }}
                            name="phone"
                            rules={[{ required: true, message: "Phone Required", pattern: new RegExp(/^[0-9]+$/) }]}
                        >
                            <Input placeholder="Enter phone number"></Input>
                        </Form.Item>
                        <Button loading={isLoading} color="primary" variant="solid" htmlType="submit">Update</Button>
                    </Form>

                </Col>
            </Row>
        </div>
    );
}
export default UserInfo