import { getDashboardDataAPI } from '@/services/api';
import { Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';


const AdminDashboard = () => {
    const formatter = (value: any) => <CountUp end={value} separator=','></CountUp>
    const [dashboardData, setDashBoardData] = useState<IDashboard>(
        {
            countUser: 0,
            countOrder: 0,
            countBook: 0
        }
    );
    useEffect(() => {
        getDashboardData();
    }, [])
    const getDashboardData = async () => {
        const res = await getDashboardDataAPI();
        if (res && res.data) {
            setDashBoardData(res.data)
        }
    }
    return (
        <Row gutter={[40, 40]}>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Total users"
                        value={dashboardData.countUser}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Total orders"
                        value={dashboardData.countOrder}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Total books"
                        value={dashboardData.countBook}
                        formatter={formatter}
                    />
                </Card>
            </Col>

        </Row>

    );
}
export default AdminDashboard;