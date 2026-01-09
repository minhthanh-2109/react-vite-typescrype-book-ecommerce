import type { FormProps } from 'antd';
import { App, Button, Divider, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss'
import { useState } from 'react';
import { loginAPI } from '@/services/api';
import { useCurrentApp } from '@/components/context/app.context';

type FieldType = {
    username: string;
    password: string;
};
const LoginPage = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const { message, notification } = App.useApp();
    const navigate = useNavigate();
    const { setIsAuthenticated, setCurrentUser } = useCurrentApp();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLogin(true);
        const res = await loginAPI(values.username, values.password);
        if (res.data) {
            message.success("Login successfully!");
            setIsAuthenticated(true);
            setCurrentUser(res.data.user);
            localStorage.setItem('access_token', res.data.access_token);
            navigate("/");
        } else {
            notification.error({
                message: 'Error when logging in!',
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsLogin(false);
    };

    return (
        <div className='login-page' >
            <main className='main'>
                <div className='container'>
                    <section className='wrapper'>
                        <div className='heading'>
                            <h2 className='text text-large'> Login</h2>
                            <Divider />
                        </div>
                        <Form
                            name="login"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout='vertical'
                        >
                            <Form.Item<FieldType>
                                label="Username"
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
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

                            <Form.Item label={null}>
                                <Button type="primary" htmlType="submit" loading={isLogin}>
                                    Log in
                                </Button>
                            </Form.Item>

                            <Divider>Or</Divider>
                            <p className='text text-normal' style={{ textAlign: 'center' }}>Do not have an account ? <Link to={'/register'}>Go to register page</Link></p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>

    );
}
export default LoginPage;