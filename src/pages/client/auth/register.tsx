import { Button, FormProps, Divider, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './register.scss';
import { useState } from 'react';
import { registerAPI } from '@/services/api';
import { App } from 'antd';


type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string
};
const RegisterPage = () => {

    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const navigate = useNavigate();
    const { message } = App.useApp()

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        // console.log({ values });
        const res = await registerAPI(values.fullName, values.email, values.password, values.phone);
        if (res.data) {
            // console.log(res);
            message.success("Register user successfully!");
            navigate('/login');

        } else {
            message.error(res.message);

        }
        setIsSubmit(false);
    };

    return (
        <div className='register-page'>
            <main className='main'>
                <div className='container'>
                    <section className='wrapper'>
                        <div className='heading'>
                            <h2 className='text text-large'> Register an account</h2>
                            <Divider />
                        </div>
                        <Form
                            name="form-register"
                            layout='vertical'
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                label="Full name"
                                name="fullName"
                                rules={[{ required: true, message: 'Please input your full name!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    { type: "email", message: 'Please fill a valid email !' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Phone"
                                name="phone"
                                rules={[
                                    { required: true, message: 'Please input your phone number!', pattern: new RegExp(/^[0-9]+$/) },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item label={null}>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Register
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className='text text-normal' style={{ textAlign: 'center' }}>Already has an account ? <Link to={'/login'}>Log in</Link></p>
                        </Form >
                    </section>
                </div>
            </main>
        </div>

    );
}
export default RegisterPage;