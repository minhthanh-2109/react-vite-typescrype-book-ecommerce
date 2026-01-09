import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import 'styles/modal.gallery.scss';
interface IProps {
    currentIndex: number,
    isOpen: boolean,
    setIsOpen: (v: boolean) => void
    imageGallery: {
        original: string,
        thumbnail: string,
        originalClass: string,
        thumbnailClass: string
    }[]
}
const ModelGallery = (props: IProps) => {
    const { currentIndex, isOpen, setIsOpen, imageGallery } = props;
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const refGallery = useRef<ImageGallery>(null);
    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex);
        }

    }, [currentIndex, isOpen]);
    return (
        <Modal
            width={'60vw'}
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null}
            className="modal-gallery"
        >
            <Row gutter={[20, 20]}>
                <Col span={16}>
                    <ImageGallery
                        ref={refGallery}
                        items={imageGallery}
                        showPlayButton={false}
                        showFullscreenButton={false}
                        slideOnThumbnailOver={true}
                        showThumbnails={false}
                        startIndex={currentIndex} //start at current index
                        onSlide={(i) => setActiveIndex(i)}
                        slideDuration={0}
                    >
                    </ImageGallery>
                </Col>
                <div className="thumbnail-list">
                    {imageGallery.map((item, index) => (
                        <Col key={`image ${index}`}>
                            <div className={`thumb-item ${activeIndex === index ? "is-active" : ""}`}>
                                <Image className="item-img"
                                    key={index}
                                    src={item.original}
                                    preview={false}
                                    width={100}
                                    height={100}
                                    onClick={() =>
                                        refGallery.current?.slideToIndex(index)
                                    }
                                />
                            </div>
                        </Col>
                    ))}
                </div>
            </Row>
        </Modal >
    );
}
export default ModelGallery