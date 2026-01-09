import { FORMATE_DATE_VN } from '@/services/helper';
import { Badge, Descriptions } from 'antd';
import { Drawer, Avatar } from 'antd';
import dayjs from 'dayjs';
interface IProps {
    userDetail: IUserTable | null
    isDrawerOpen: boolean
    setIsDrawerOpen: (v: boolean) => void
    setUserDetail: (v: IUserTable | null) => void
}

const UserDetail = (props: IProps) => {
    const { isDrawerOpen, setIsDrawerOpen, userDetail, setUserDetail } = props;
    // console.log(userDetail);
    const onClose = () => {
        setIsDrawerOpen(false);
        setUserDetail(null);
    }
    const avatarUrl = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userDetail?.avatar}`;

    return (
        <div>
            <Drawer title="User information"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={isDrawerOpen}
                width={"50vw"}
            >
                <Descriptions
                    column={2}
                    bordered={true}
                    title="User Info"
                >
                    <Descriptions.Item label="Id">{userDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="User name">{userDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{userDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone number">{userDetail?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Role">
                        {userDetail?.role === "ADMIN" &&
                            <Badge color='blue' status='processing' text={userDetail?.role} />
                        }
                        {userDetail?.role === "USER" &&
                            <Badge color='green' status='processing' text={userDetail?.role} />
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Avatar">
                        <Avatar size={40} src={avatarUrl}></Avatar>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created at">{dayjs(userDetail?.createdAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                    <Descriptions.Item label="Update at">{dayjs(userDetail?.updatedAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                </Descriptions>
            </Drawer>
        </div>
    );

}
export default UserDetail;