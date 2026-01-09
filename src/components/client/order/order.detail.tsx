import { useCurrentApp } from "@/components/context/app.context";
import { DeleteTwoTone } from "@ant-design/icons";
import { Button, Col, Divider, InputNumber, message, Popconfirm, Row } from "antd";
import { useEffect, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import 'styles/order.detail.scss';

interface IProps {
    setCurrentStep: (v: number) => void
}
const OrderDetail = (props: IProps) => {
    const { carts, setCarts } = useCurrentApp();
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setCurrentStep } = props;
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
    const [messageApi, holder] = message.useMessage()

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        // console.log(e);
        messageApi.error('Delete cancel');
    };
    const handleDeleteItem = (_id: string) => {
        setIsLoading(true);
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            const carts = JSON.parse(cartStorage) as ICart[];
            const newCarts = carts.filter((item) => item._id != _id);
            localStorage.setItem("carts", JSON.stringify(newCarts));
            setCarts(newCarts);
            setIsLoading(false);
        }

    }
    const handleOnChange = (value: number, itemDetail: IBookTable) => {
        if (!value || +value < 1) return;
        if (!isNaN(+value)) {
            //update localStorage
            const cartStorage = localStorage.getItem("carts");
            if (cartStorage && itemDetail) {
                //update
                const carts = JSON.parse(cartStorage) as ICart[];
                //check index
                const isExistedIndex = carts.findIndex(c => c._id === itemDetail?._id);
                if (isExistedIndex > -1) {
                    carts[isExistedIndex].quantity = +value;
                }
                localStorage.setItem("carts", JSON.stringify(carts));

                //sync with context
                setCarts(carts)
            }
        }
    }
    const handleSetStep = () => {
        if (!carts.length) {
            message.error("Your cart is empty");
            return;
        }
        setCurrentStep(1);
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
                                                    onChange={(value) => handleOnChange(value as number, item.bookDetail)}
                                                    value={item.quantity} />
                                            </div>
                                            <div className="sum">
                                                Total:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice ?? 0)}
                                            </div>
                                            {holder}
                                            <Popconfirm
                                                title="Remove item from cart"
                                                description="Are you sure to delete this item?"
                                                onConfirm={() => handleDeleteItem(item._id)}
                                                onCancel={cancel}
                                                okText="Yes"
                                                cancelText="No"
                                                okButtonProps={
                                                    { loading: isLoading }
                                                }
                                            >
                                                <DeleteTwoTone
                                                    style={{ cursor: 'pointer' }}
                                                    // onClick={() => handleDeleteItem(item._id)}
                                                    twoToneColor="#eb2f96" />
                                            </Popconfirm>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Col>
                    <Col md={6} xs={24}>
                        <div className="total-price">
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
                                <Button style={{ width: '100%' }} color="danger" variant="solid" onClick={() => handleSetStep()}>
                                    <BsCartPlus className="icon-cart"
                                    />
                                    <span> Buy now ({carts.length})</span>
                                </Button>
                            </div>

                        </div>

                    </Col>
                </Row>
            </div>
        </div>
    );
}
export default OrderDetail