import { callUploadBookImgAPI, createBookAPI, getCategoryAPI } from "@/services/api";
import { Modal, Form, Input, App, InputNumber, Select, Row, Col } from "antd";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { UploadChangeParam } from "antd/es/upload";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
type FieldType = {
    mainText: string,
    author: string,
    price: number,
    category: string,
    quantity: number,
    thumbnail: any,
    slider: any
};
interface IProps {
    isModalAddOpen: boolean,
    setIsModalAddOpen: (v: boolean) => void
    refreshTable: () => void
}
type UserUploadType = 'thumbnail' | 'slider';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
const AddNewBook = (props: IProps) => {
    const { isModalAddOpen, setIsModalAddOpen, refreshTable } = props;
    const [form] = Form.useForm();
    const { notification, message } = App.useApp();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [category, setCategory] = useState<{ value: string, label: string }[]>([])
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([])
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([])
    useEffect(() => {
        loadCategory();
    }, []);

    const loadCategory = async () => {
        const res = await getCategoryAPI();
        if (res.data) {
            // console.log(res.data);
            const d = res.data.map((item) => {
                return { label: item, value: item }
            })
            setCategory(d);
        }
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    // xử lý onChange trên Upload
    const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
        if (info.file.status === 'uploading') {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }
        if (info.file.status === 'done') {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };
    //xử lý upload file
    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await callUploadBookImgAPI(file, 'book');
        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }
            if (type === 'thumbnail') {
                setFileListThumbnail([{ ...uploadedFile }]);
            }
            if (type === 'slider') {
                setFileListSlider((prevState) => [...prevState, { ...uploadedFile }])
            }
            if (onSuccess) {
                onSuccess('Ok');
            }
        } else {
            message.error(res.message);
        }
    }

    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === 'thumbnail') {
            setFileListThumbnail([]);
        }
        if (type === 'slider') {
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    }


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true);
        // console.log('form values', values);
        // console.log('thumbnail list:', fileListThumbnail);
        // console.log('slider list', fileListSlider)
        const thumbnail = fileListThumbnail[0]?.name ?? "";
        const slider = fileListSlider.map(item => item.name) ?? [];
        const res = await createBookAPI(
            values.mainText, values.author, values.price,
            values.quantity, values.category, thumbnail, slider);
        if (res && res.data) {
            message.success('Create book successfully!');
        } else {
            notification.error(
                {
                    message: 'Error when create book',
                    description: res.message,
                }
            )
        }
        setIsLoading(false);
        refreshTable();
        resetAndClosedModal();
    };

    const resetAndClosedModal = () => {
        form.resetFields();
        setFileListSlider([]);
        setFileListThumbnail([]);
        setIsModalAddOpen(false);
    }
    //xu ly du lieu va giao dien file truoc khi upload
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE} MB`);
        }
        //validate và không hiển thị ảnh nếu không thỏa mãn điều kiện
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };
    const normFile = (e: any): UploadFile[] => {
        if (Array.isArray(e)) {
            return e;
        }

        return e.fileList ?? [];
    };

    return (
        <div className='user-form' style={{ margin: "20px 0" }}>
            <Modal
                width={'45vw'}
                title="Enter book information"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalAddOpen}
                onOk={() => { form.submit() }}
                onCancel={() => { resetAndClosedModal() }}
                maskClosable={false}
                okText={"ADD"}
                okButtonProps={{
                    loading: isLoading
                }}
                // loading={isLoading}
                destroyOnClose
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Title"
                                name="mainText"
                                rules={[{ required: true, message: "Title required" }]}
                            >
                                <Input placeholder="Enter title" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Author"
                                name="author"
                                rules={[{ required: true, message: "Author Required" }]}
                            >
                                <Input placeholder="Enter Author" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[{ required: true, message: "Price Required" }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                    placeholder="Price"
                                    addonAfter="đ"
                                    formatter={(value) =>
                                        value?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                    }
                                    parser={(value) => value!.replace(/\./g, "")}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: "Category Required" }]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    options={category}
                                    showSearch
                                    allowClear
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Quantity"
                                name="quantity"
                                rules={[{ required: true, message: "Quantity Required" }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                    placeholder="Quantity"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Thumbnail"
                                name="thumbnail"
                                // rules={[{ required: true, message: "Thumbnail required" }]}
                                //convert value from upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}

                            >
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                    onPreview={handlePreview}
                                    onChange={(info) => { handleChange(info, 'thumbnail') }}
                                    beforeUpload={beforeUpload}
                                    onRemove={(file) => handleRemove(file, 'thumbnail')}
                                    fileList={fileListThumbnail}
                                >
                                    <div>
                                        {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Slider images"
                                name="slider"
                                //convert value from upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    multiple
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={(info) => handleUploadFile(info, 'slider')}
                                    onPreview={handlePreview}
                                    onChange={(info) => { handleChange(info, 'slider') }}
                                    beforeUpload={beforeUpload}
                                    onRemove={(file) => { handleRemove(file, 'slider') }}
                                    fileList={fileListSlider}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Modal>
        </div>
    );
}
export default AddNewBook;