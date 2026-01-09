import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { App, Col, Divider, Rate, Row } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import 'styles/book.client.detail.scss';
import ModelGallery from "components/client/book/model.gallery";
import { useCurrentApp } from "@/components/context/app.context";
import { useNavigate } from "react-router-dom";
interface IProps {
    book: IBookTable | null
}
type UserActions = "MINUS" | "PLUS";

const BookClientDetail = (props: IProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { carts, setCarts, currentUser } = useCurrentApp();
    const { book } = props;
    const refGalleryDesktop = useRef<ImageGallery>(null);
    const { message } = App.useApp();
    const [imageGallery, setImageGallery] = useState<
        {
            original: string,
            thumbnail: string,
            originalClass: string,
            thumbnailClass: string
        }[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentQuantity, setCurrentQuantity] = useState<number>(1);
    const navigate = useNavigate();
    useEffect(() => {
        if (book) {
            const images = [];
            if (book.thumbnail) {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${book.thumbnail}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${book.thumbnail}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    },
                );
            };
            if (book.slider) {
                const sliderImg = book.slider.map((item) => {
                    return {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image",
                    };
                });
                images.push(...sliderImg);
            };
            setImageGallery(images);
        }
    }, [book]);
    const handleChangeButton = (type: UserActions) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 < 0) return;
            setCurrentQuantity(currentQuantity - 1);
        }
        if (type === "PLUS" && book) {
            if (currentQuantity === +book.quantity) return;
            setCurrentQuantity(currentQuantity + 1);
        }

    }
    const handleChangeInput = (value: string) => {
        if (!isNaN(+value)) {
            if (+value > 0 && book && + value < +book.quantity) {
                setCurrentQuantity(+value);
            }
        }
    }
    const handleOnClickImage = () => {
        setIsOpen(true);
        // console.log(refGalleryDesktop.current?.getCurrentIndex())
        setCurrentIndex(refGalleryDesktop.current?.getCurrentIndex() ?? 0);
    }

    const handleAddToCart = (isBuyNow = false) => {
        debugger
        if (!currentUser) {
            message.error("Please login to add item to cart");
            return;
        }
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && book) {
            // Update
            const carts = JSON.parse(cartStorage) as ICart[];
            // check existed
            const isExistedIndex = carts.findIndex(c => c._id === book?._id);
            if (isExistedIndex > -1) {
                carts[isExistedIndex].quantity = carts[isExistedIndex].quantity + currentQuantity;
            } else {
                carts.push({
                    quantity: currentQuantity,
                    _id: book?._id,
                    bookDetail: book!
                });
            }
            localStorage.setItem("carts", JSON.stringify(carts));
            //sync react context
            setCarts(carts)
        } else {
            const data = [{
                quantity: currentQuantity,
                _id: book?._id,
                bookDetail: book!
            }]
            localStorage.setItem("carts", JSON.stringify(data));
            //sync react context
            setCarts(data);
        }
        if (isBuyNow) {
            navigate("/order");
        } else {
            message.success(`Adding ${book?.mainText} to cart successfully!`);
        }
    }
    // console.log(carts)
    // const images = [

    //     {
    //         original: "https://picsum.photos/id/1018/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1018/250/150/",
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: "https://picsum.photos/id/1015/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1015/250/150/",
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    //     {
    //         original: "https://picsum.photos/id/1019/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1019/250/150/",
    //         originalClass: "original-image",
    //         thumbnailClass: "thumbnail-image"
    //     },
    // ];
    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="view-detail-book" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div style={{ padding: '20px', background: "#fff", borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <ImageGallery
                                ref={refGalleryDesktop}
                                items={imageGallery}
                                showPlayButton={false}
                                renderLeftNav={() => <></>}
                                renderRightNav={() => <></>}
                                showFullscreenButton={false}
                                slideOnThumbnailOver={true}
                                onClick={() => handleOnClickImage()}
                            >
                            </ImageGallery>
                        </Col>
                        <Col md={14} sm={24}>
                            <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    items={imageGallery}
                                    showPlayButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    showFullscreenButton={false}
                                    slideOnThumbnailOver={true}
                                    onClick={() => handleOnClickImage()}
                                >
                                </ImageGallery>
                            </Col>
                            <Col span={24}>
                                <div className="author">
                                    Author <a href="#">{book?.author}</a>
                                </div>
                                <div className="title"> {book?.mainText} </div>
                                <div className="rating">
                                    <Rate value={5} disabled style={{ color: '#ffce3d' }}></Rate>
                                    <span className="sold"> {book?.sold}
                                        <Divider type="vertical"></Divider>
                                        Sold</span>
                                </div>
                                <div className="price">
                                    <span className="currency">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.price ?? 0)}
                                    </span>
                                </div>
                                <div className="delivery">
                                    <div>
                                        <span className="left">Delivery</span>
                                        <span className="right">Free Delivery</span>
                                    </div>
                                </div>
                                <div className="quantity">
                                    <span className="left">Amount</span>
                                    <span className="right">
                                        <button onClick={() => handleChangeButton('MINUS')}><MinusOutlined /></button>
                                        <input onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} />
                                        <button onClick={() => handleChangeButton('PLUS')}><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className="buy">
                                    <button className="cart" onClick={() => handleAddToCart()}>
                                        <BsCartPlus className="icon-cart" />
                                        <span>Add to cart</span>
                                    </button>
                                    <button onClick={() => handleAddToCart(true)} className="buy-now">Buy now</button>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModelGallery
                currentIndex={currentIndex}
                isOpen={isOpen}
                imageGallery={imageGallery}
                setIsOpen={setIsOpen}
            />
        </div >
    );
}
export default BookClientDetail