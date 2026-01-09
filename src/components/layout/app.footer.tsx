// components/Footer.tsx
import { Row, Col } from "antd";
import {
    FacebookFilled,
    InstagramFilled,
    YoutubeFilled,
} from "@ant-design/icons";
import "./footer.scss";

const AppFooter = () => {
    return (
        <footer className="app-footer">
            <div className="footer-container">
                <Row gutter={[24, 24]}>
                    <Col md={6} sm={12} xs={24}>
                        <h4>Customer Support</h4>
                        <ul>
                            <li>Help Center</li>
                            <li>Shopping Guide</li>
                            <li>Shipping & Payment</li>
                            <li>Return Policy</li>
                        </ul>
                    </Col>

                    <Col md={6} sm={12} xs={24}>
                        <h4>About Us</h4>
                        <ul>
                            <li>Company Info</li>
                            <li>Careers</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </Col>

                    <Col md={6} sm={12} xs={24}>
                        <h4>Categories</h4>
                        <ul>
                            <li>Books</li>
                            <li>Comics</li>
                            <li>Business</li>
                            <li>Self-help</li>
                        </ul>
                    </Col>

                    <Col md={6} sm={12} xs={24}>
                        <h4>Follow Us</h4>
                        <div className="socials">
                            <FacebookFilled />
                            <InstagramFilled />
                            <YoutubeFilled />
                        </div>
                    </Col>
                </Row>

                <div className="footer-bottom">
                    © {new Date().getFullYear()} Book Store. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default AppFooter;
