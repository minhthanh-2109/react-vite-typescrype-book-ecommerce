import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Spin, Tabs } from "antd";
import { useForm } from "antd/es/form/Form";
import type { TabsProps } from 'antd';
import 'styles/home.scss'
import { useEffect, useState } from "react";
import { getBookAPI, getCategoryAPI } from "@/services/api";
import { FormProps } from "antd/lib";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Drawer } from "antd";

type FieldType = {
    range: {
        from: number,
        to: number,
    }
    category: string[],
}

const HomePage = () => {
    const navigate = useNavigate();
    const [form] = useForm();
    const [listCategory, setListCategory] = useState<{
        label: string,
        value: string
    }[]>([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [bookList, setBookList] = useState<IBookTable[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");
    const [filter, setFilter] = useState<string>('');
    const [openFilter, setOpenFilter] = useState(false);
    const [searchItem] = useOutletContext() as any;

    useEffect(() => {
        getCategory();
    }, []);
    const getCategory = async () => {
        const res = await getCategoryAPI();
        if (res && res.data) {
            console.log(res.data);
            setListCategory(res.data.map((item) => {
                return ({ label: item, value: item });
            }))
        }
    }
    useEffect(() => {
        getAllBook()
    }, [current, pageSize, filter, sortQuery, searchItem]);
    const getAllBook = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        if (filter) {
            query += `&${filter}`
        }
        if (searchItem) {
            query += `&mainText=/${searchItem}/i`
        }
        const res = await getBookAPI(query);
        if (res && res.data) {
            // console.log(res.data.result);
            setBookList(res.data.result);
            setTotal(res.data?.meta.total ?? 0);
        }
        setIsLoading(false);
    }
    const handlePageChange = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current != current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize != pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }

    }

    // const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    //     console.log('checked = ', checkedValues);
    // };

    // const plainOptions = ['Apple', 'Pear', 'Orange'];

    // const options: CheckboxOptionType<string>[] = [
    //     { label: 'Apple', value: 'Apple', className: 'label-1' },
    //     { label: 'Pear', value: 'Pear', className: 'label-2' },
    //     { label: 'Orange', value: 'Orange', className: 'label-3' },
    // ];

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        // console.log('Success:', values);
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
            if (values?.range?.from == null && values?.range?.to == null) {
                f = '';
            }
            if (values?.category?.length > 0) {
                const cate = values?.category?.join(',');
                f += `&category=${cate}`;
            }
            setFilter(f);
        }
    };
    const handleChangeFilter = (changedValues: any, values: any) => {
        // console.log(changedValues, values);
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(',');
                setFilter(`category=${f}`);
            } else {
                //reset data
                setFilter('');
            }
        }

    };

    const items: TabsProps['items'] = [
        {
            key: 'sort=-sold',
            label: 'Popular',
            children: <></>,
        },
        {
            key: 'sort=-createdAt',
            label: 'Newest',
            children: <></>,
        },
        {
            key: 'sort=price',
            label: 'Price - Lowest to Highest',
            children: <></>,
        },
        {
            key: 'sort=-price',
            label: 'Price - Highest to Lowest',
            children: <></>,
        },
    ];

    return (
        <div className="homepage">
            <Drawer
                title="Filter"
                placement="right"
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                width={300}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onValuesChange={handleChangeFilter}

                >
                    {/* Category */}
                    <Form.Item name="category" label="Category" className="filter-form-mobile">
                        <Checkbox.Group className="filter-item">
                            {listCategory.map((item, index) => (
                                <Checkbox key={index} value={item.value}>
                                    {item.value}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>

                    <Divider />

                    {/* Price */}
                    <Form.Item label="Price Range">
                        <Form.Item name={["range", "from"]}>
                            <InputNumber placeholder="From" style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name={["range", "to"]}>
                            <InputNumber placeholder="To" style={{ width: "100%" }} />
                        </Form.Item>
                    </Form.Item>

                    <Button type="primary" block onClick={() => form.submit()}>
                        Apply
                    </Button>
                </Form>
            </Drawer>
            <div className="homepage-container" >
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0} >
                        <div className="filter-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 600 }}><FilterTwoTone></FilterTwoTone> Filter Search</span>
                                <ReloadOutlined title="Reset" onClick={() => { setFilter(''); form.resetFields() }}></ReloadOutlined>
                            </div>
                            <Form
                                form={form}
                                onFinish={onFinish}
                                onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                            >
                                <Form.Item
                                    name='category'
                                    label='Category'
                                    labelCol={{ span: 24 }}
                                >
                                    <Checkbox.Group>
                                        <Row>
                                            {listCategory.map((item, index) => {
                                                return (
                                                    <Col span={24} key={`index-${index}`}>
                                                        <Checkbox value={item.value}>{item.value}</Checkbox>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Divider />

                                <Form.Item
                                    label="Price Range"
                                    labelCol={{ span: 24 }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Form.Item name={["range", "from"]}>
                                            <InputNumber
                                                name="from"
                                                min={0}
                                                placeholder="đ From"
                                                formatter={(value) =>
                                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                                parser={(value) => `${value}`.replace(/\./g, "")}>
                                            </InputNumber>
                                        </Form.Item>
                                        <span> - </span>
                                        <Form.Item name={["range", "to"]}>
                                            <InputNumber
                                                name="to"
                                                min={0}
                                                placeholder="đ To"
                                                formatter={(value) =>
                                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                                parser={(value) => `${value}`.replace(/\./g, "")}>
                                            </InputNumber>
                                        </Form.Item>

                                    </div>
                                    <div>
                                        <Button onClick={() => form.submit()} style={{ width: '100%' }} type="primary">Apply</Button>
                                    </div>
                                </Form.Item>
                                <Divider />
                                <Form.Item
                                    label='Rating'
                                    labelCol={{ span: 24 }}>
                                    <div>
                                        <Rate value={5} disabled style={{ color: '#ffce3d' }} />
                                        <span className="ant-rate-text"></span>
                                    </div>
                                    <div>
                                        <Rate value={4} disabled style={{ color: '#ffce3d' }} />
                                        <span className="ant-rate-text">  above</span>
                                    </div>
                                    <div>
                                        <Rate value={4} disabled style={{ color: '#ffce3d' }} />
                                        <span className="ant-rate-text">  above</span>
                                    </div>
                                    <div>
                                        <Rate value={3} disabled style={{ color: '#ffce3d' }} />
                                        <span className="ant-rate-text">  above</span>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                    <Col md={20} sm={24} >
                        <Spin spinning={isLoading} size="large" tip='Loading...'>
                            <div className="products">
                                <Row className="mobile-filter-bar">
                                    <Button
                                        icon={<FilterTwoTone />}
                                        onClick={() => setOpenFilter(true)}
                                    >
                                        Filter
                                    </Button>
                                </Row>

                                <Row>
                                    <Tabs defaultActiveKey="sort=-sold" items={items} onChange={(value) => setSortQuery(value)} style={{ overflowX: "auto" }}></Tabs>
                                </Row>
                                <Row className="customize-row">
                                    {bookList?.map((item, index) => {
                                        return (
                                            <div onClick={() => navigate(`/book/${item._id}`)} className="column" key={`book-${index}`}>
                                                <div className="wrapper">
                                                    <div className="thumbnail">
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="bookImg" />
                                                    </div>
                                                    <div className='text'>{item.mainText}</div>
                                                    <div className='price'>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                    </div>
                                                    <div className="rating">
                                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                        <span> {item.sold ?? 0} Sold</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Row>
                                <Divider />
                                <Row className="pagination-row" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Pagination
                                        current={current}
                                        pageSize={pageSize}
                                        total={total}
                                        onChange={(page, pageSize) => {
                                            handlePageChange({ current: page, pageSize: pageSize })
                                        }}
                                        responsive />
                                </Row>
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div >
        </div >

    );
}
export default HomePage;