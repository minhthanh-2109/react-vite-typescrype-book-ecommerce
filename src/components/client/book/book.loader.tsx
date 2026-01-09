import { Col, Row, Skeleton } from "antd";
import SkeletonInput from "antd/es/skeleton/Input";

const BookLoader = () => {
    return (
        <div style={{ background: '#efefef', padding: '20px auto' }}>
            <div className="view-detail-book" style={{ maxWidth: 1440, margin: '0px auto', padding: '30px' }}>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <SkeletonInput
                                active
                                block
                                style={{ width: '100%', height: 350 }}
                            />
                            <div style={{ display: 'flex', gap: 20, marginTop: 20, justifyContent: 'center' }}>
                                <Skeleton.Image active />
                                <Skeleton.Image active />
                                <Skeleton.Image active />
                            </div>
                        </Col>
                        <Col md={14} sm={24}>
                            <Skeleton paragraph={{ rows: 3 }} />
                            <br />
                            <Skeleton paragraph={{ rows: 2 }} />
                            <br /><br />
                            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                                <Skeleton.Button active style={{ width: 100 }} />
                                <Skeleton.Button active style={{ width: 100 }} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}
export default BookLoader;