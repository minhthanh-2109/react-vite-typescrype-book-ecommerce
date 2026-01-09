import { FORMATE_DATE_VN } from '@/services/helper';
import { Badge, Descriptions, Divider } from 'antd';
import { Drawer, Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
interface IProps {
    bookDetail: IBookTable | null
    isDrawerOpen: boolean
    setIsDrawerOpen: (v: boolean) => void
    setBookDetail: (v: IBookTable | null) => void
}

const BookDetail = (props: IProps) => {
    const { isDrawerOpen, setIsDrawerOpen, bookDetail, setBookDetail } = props;

    // console.log(bookDetail);
    const onClose = () => {
        setIsDrawerOpen(false);
        setBookDetail(null);
    }
    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    useEffect(() => {
        if (bookDetail) {
            let imgThumbnail: any = {}
            const imgSlider: UploadFile[] = [];
            if (bookDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: bookDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookDetail?.thumbnail}`
                }
            }
            if (bookDetail.slider && bookDetail.slider.length > 0) {
                bookDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [bookDetail])
    // {
    //     uid: '-1',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //     uid: '-2',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //     uid: '-3',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //     uid: '-4',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },

    // {
    //     uid: '-5',
    //     name: 'image.png',
    //     status: 'error',
    // },
    // ]);
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (
        <div>
            <Drawer title="User information"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={isDrawerOpen}
                width={"60vw"}
            >
                <Descriptions
                    column={2}
                    bordered={true}
                    title="User Info"
                >
                    <Descriptions.Item label="Id">{bookDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Title">{bookDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Author">{bookDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Quantity">{bookDetail?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Price">{bookDetail?.price}</Descriptions.Item>
                    <Descriptions.Item label="Category">
                        <Badge color='blue' status='processing' text={bookDetail?.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created at">{dayjs(bookDetail?.createdAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                    <Descriptions.Item label="Update at">{dayjs(bookDetail?.updatedAt).format(FORMATE_DATE_VN)}</Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: '10px' }}>
                    <Divider orientation='left' style={{ fontWeight: '600' }}>Book thumbnails</Divider>
                </div>
                <Upload
                    // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{ showRemoveIcon: false }

                    }
                >
                </Upload>
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
            </Drawer>
        </div>
    );

}
export default BookDetail;