import OrderDetail from "@/components/client/order/order.detail";
import Payment from "@/components/client/order/payment";
import { Button, Result, Steps } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const OrderPage = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    return (
        <div style={{ background: '#efefef', padding: '20px 0' }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div className="order-steps" style={{
                    padding: '20px',
                    background: '#fff',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    transition: 'box-shadow 0.2s ease'
                }}>
                    <Steps
                        size="small"
                        current={currentStep}
                        items={[
                            { title: "Your items" },
                            { title: "Order" },
                            { title: "Payment" }
                        ]}
                    >
                    </Steps>
                </div>
                {currentStep === 0 && <OrderDetail setCurrentStep={setCurrentStep} />}
                {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}
                {currentStep === 2 &&
                    <Result
                        status="success"
                        title="Order successfully"
                        subTitle="You order will be proceeded"
                        extra={[
                            <Button key='home'>
                                <Link to={"/"} type="primary">Home page</Link>
                            </Button>,
                            <Button key='history'>
                                <Link to={"/history"} type="primary">History</Link>
                            </Button>,

                        ]}
                    >
                    </Result>
                }
            </div>

        </div >
    );
}
export default OrderPage;