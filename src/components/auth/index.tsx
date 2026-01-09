import { useCurrentApp } from "components/context/app.context";
import { Button, Result } from 'antd';
import { Link, useLocation } from "react-router-dom";

interface IProps {
    children: React.ReactNode
}
const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, currentUser } = useCurrentApp();
    const location = useLocation();
    if (isAuthenticated === false) {
        return (
            <Result
                status="404"
                title="Not Login"
                subTitle="Sorry, you need to login to use this page."
                extra={<Button type="primary"><Link to={"/"}>Back Home </Link></Button>}
            />
        )
    }
    const isAdminRoute = location.pathname.includes("admin")
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = currentUser?.role;
        if (role === 'USER') {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to open this page"
                    extra={<Button type="primary"><Link to={"/"}>Back Home </Link></Button>}
                />
            )
        }
    }
    return (
        <>
            {props.children}
        </>
    )
}
export default ProtectedRoute;