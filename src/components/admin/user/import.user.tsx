import { InboxOutlined } from "@ant-design/icons";
import { App, Modal } from "antd";
import type { UploadProps } from 'antd';
import { Upload, Table } from 'antd';
import { useState } from "react";
import { Buffer } from 'buffer';
import Exceljs from 'exceljs';
import { bulkCreateUserAPI } from "@/services/api";
import excelTemplate from 'assets/template/user.xlsx?url';


interface IProps {
    isModalImportOpen: boolean,
    setIsModalImportOpen: (v: boolean) => void
    refreshTable: () => void
}
interface IDataImport {
    fullName: string,
    email: string,
    phone: string,
}
const ImportUser = (props: IProps) => {
    const { isModalImportOpen, setIsModalImportOpen, refreshTable } = props
    const [isLoadingImport, setIsLoadingImport] = useState<boolean>(false);
    const { Dragger } = Upload;
    const { message, notification } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        // beforeUpload: () => {
        //     return false;
        // },
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000);
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;
                    //load file to buffer
                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    //convert file to json
                    const jsonData: IDataImport[] = [];
                    workbook.eachSheet((sheet) => {
                        const headerRow = sheet.getRow(1);

                        const headers: string[] = [];
                        headerRow.eachCell((cell, colNumber) => {
                            headers[colNumber] = String(cell.value).trim();
                        });

                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber === 1) return;

                            const item: any = {};
                            row.eachCell((cell, colNumber) => {
                                const key = headers[colNumber];
                                if (key) {
                                    item[key] = cell.value;
                                    item.id = cell.$col$row
                                }
                            });

                            jsonData.push(item as IDataImport);
                        });
                    });
                    setDataImport(jsonData);
                    // console.log(jsonData);

                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
        },
        onRemove() {
            setDataImport([]);
        }

    };
    const resetAndClosedModal = () => {
        setIsModalImportOpen(false);
        setDataImport([]);

    }
    //import user
    const handleImport = async () => {
        setIsLoadingImport(true);
        //chen them pw vao moi item
        const dataSubmit = dataImport.map(item => ({
            ...item,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }))
        // console.log(dataSubmit);
        const res = await bulkCreateUserAPI(dataSubmit);
        if (res.data) {
            if (+res.data.countSuccess > 0) {
                notification.success({
                    message: "Bulk Create Users",
                    description: `Success = ${res.data.countSuccess}`
                });
            } else {
                notification.error({
                    message: "Bulk Create Users",
                    description: `Error = ${res.data.countError}`
                });
            }

        }
        setIsLoadingImport(false);
        resetAndClosedModal();
        refreshTable();
    }

    const columns = [
        {
            title: 'Full name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone number',
            dataIndex: 'phone',
        },
    ];
    return (
        <div>
            <Modal
                title="Upload file"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalImportOpen}
                onOk={() => { handleImport() }}
                onCancel={() => { resetAndClosedModal() }}
                maskClosable={false}
                okText={"IMPORT"}
                width={'50vw'}
                destroyOnClose={true}
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: isLoadingImport
                }}
            >
                <div>
                    <Dragger {...uploadProps}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Only support for a single upload. Strictly prohibited from uploading csv, xlsx, xls file.
                            &nbsp;
                            <a onClick={e => e.stopPropagation()} href={excelTemplate} download>Download Sample File</a>
                        </p>
                    </Dragger>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <h4>User information uploaded:</h4>
                </div>
                <div>
                    <Table rowKey="id" dataSource={dataImport} columns={columns} />
                </div>


            </Modal>
        </div >
    );

}
export default ImportUser;