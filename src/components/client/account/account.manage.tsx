import { Modal } from "antd";
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import UserInfo from "./user.info";
import ChangePassword from "./change.password";


interface IProps {
    isModalOpen: boolean
    setIsModalOpen: (v: boolean) => void
}
const ManageAccount = (props: IProps) => {
    const { isModalOpen, setIsModalOpen } = props;
    const onChange = (key: string) => {
        // console.log(key);
    };
    const items: TabsProps['items'] = [
        {
            key: 'info',
            label: 'Information',
            children: <UserInfo ></UserInfo>,
        },
        {
            key: 'password',
            label: 'Change Password',
            children: <ChangePassword></ChangePassword>,
        }
    ];
    return (
        <Modal
            title="Account Management"
            open={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
            maskClosable={false}
            width={"60vw"}
        >
            <Tabs defaultActiveKey="info" items={items} onChange={onChange} />
        </Modal>
    );
}
export default ManageAccount