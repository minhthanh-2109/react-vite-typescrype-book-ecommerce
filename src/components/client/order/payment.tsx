import { useCurrentApp } from "@/components/context/app.context";
import { createOrderAPI } from "@/services/api";
import { LeftOutlined } from "@ant-design/icons";
import { Col, Divider, Form, Input, InputNumber, Radio, Row, Space, FormProps, Button, App } from "antd";
import { useForm } from "antd/es/form/Form";
// import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import 'styles/order.detail.scss';

const { TextArea } = Input;
interface IProps {
    setCurrentStep: (v: number) => void
}
type PaymentType = "BANKING" | "COD";

interface FieldType {
    fullName: string;
    phone: string;
    address: string;
    method: PaymentType
}
const Payment = (props: IProps) => {
    const { carts, setCarts, currentUser } = useCurrentApp();
    const [total, setTotal] = useState<number>(0);
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const [form] = useForm();
    const { setCurrentStep } = props;
    const { message, notification } = App.useApp();
    useEffect(() => {
        if (currentUser) {
            form.setFieldsValue(
                {
                    fullName: currentUser.fullName,
                    phone: currentUser.phone,
                    method: "COD"
                }
            )
        }

    }, [currentUser]);


    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.bookDetail.price;
            })
            setTotal(sum);
        } else {
            setTotal(0);
        }
    }, [carts]);

    const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (values) => {
        const { address, fullName, method, phone } = values;
        const detail = carts.map(item => ({
            _id: item._id,
            quantity: item.quantity,
            bookName: item.bookDetail.mainText
        }))
        setIsSubmit(true);
        const res = await createOrderAPI(fullName, address, phone, total, method, detail);
        if (res && res.data) {
            localStorage.removeItem("carts");
            setCarts([]);
            message.success("Order successfully!")
            setCurrentStep(2);
        } else {
            notification.error({
                message: "Something went wrong!",
                description: res.message
            })
        }
        setIsSubmit(false);
    }
    return (
        <div style={{ background: '#efefef', padding: '20px 0' }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto', overflow: 'hidden' }}>
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
                        {carts?.map((item, index) => {
                            const currentBookPrice = (item?.bookDetail?.price * item?.quantity);
                            return (
                                <div className="order-book" key={`book ${index}`}>
                                    <div className="book-content">
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.bookDetail?.thumbnail}`} alt="Book Thumbnail" />
                                        <div className="title">
                                            {item?.bookDetail?.mainText}
                                        </div>
                                        <div className="price">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.bookDetail?.price ?? 0)}
                                        </div>
                                        <div className="action">
                                            <div className="quantity">
                                                <InputNumber
                                                    disabled={true}
                                                    value={item.quantity} />
                                            </div>
                                            <div className="sum">
                                                Total:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice ?? 0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div>
                            <button className="return-btn" onClick={() => setCurrentStep(0)}>
                                <LeftOutlined></LeftOutlined>
                                <span
                                    style={{ cursor: "pointer" }}
                                >
                                    Return
                                </span>
                            </button>

                        </div>
                    </Col>
                    <Col md={6} xs={24}>
                        <div className="total-price">
                            <Form
                                form={form}
                                name="Payment form"
                                onFinish={handlePlaceOrder}
                                autoComplete="off"
                                layout="vertical"
                            >
                                <div className="order-sum">
                                    <Form.Item<FieldType>
                                        label="Payment method"
                                        name="method"
                                    >
                                        <Radio.Group>
                                            <Space direction="vertical">
                                                <Radio value={"COD"}>Cash on Delivery</Radio>
                                                <Radio value={"BANKING"}>Online Payment</Radio>
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="Full name"
                                        name="fullName"
                                        rules={[
                                            { required: true, message: 'Full name is required' }
                                        ]}
                                    >
                                        <Input placeholder="Enter your full name"></Input>
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="Phone number"
                                        name="phone"
                                        rules={[{ required: true, message: "Phone Required", pattern: new RegExp(/^[0-9]+$/) }]}
                                    >
                                        <Input placeholder="Enter phone number" />
                                    </Form.Item>
                                    <Form.Item<FieldType>
                                        label="Address"
                                        name="address"
                                        rules={[{ required: true, message: "Address is required" }]}
                                    >
                                        <TextArea rows={4} />
                                    </Form.Item>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>Temporarily calculated</div>
                                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((total) ?? 0)}</div>
                                </div>
                                <Divider />
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>Total</div>
                                    <div className="total-price-value">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((total) ?? 0)}</div>
                                </div>
                                <Divider />
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button loading={isSubmit} style={{ width: '100%' }} color="danger" variant="solid" htmlType="submit">
                                        <BsCartPlus className="icon-cart"
                                        />
                                        <span> Buy now ({carts.length})</span>
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row >
            </div >
        </div >
    );
}
export default Payment