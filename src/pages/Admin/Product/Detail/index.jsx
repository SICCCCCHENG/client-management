import React, {Component} from 'react';
import {Card, List, message} from "antd";
import {ArrowLeftOutlined, ArrowRightOutlined} from '@ant-design/icons'
import './index.css'
import img from "../../../../assets/images/bob.jpeg"
import {reqCategories, reqCategoryName} from "../../../../api";

class Detail extends Component {
    state = {
        pCategoryName: '',
        categoryName: ''
    }

    /*getCategoryName = async (productObj) => {
        const {pCategoryId, categoryId} = productObj
        const result = await reqCategories(pCategoryId)
        console.log("我在这里...", result)
        let resultObj
        if (result.status === 0) {
            resultObj = result.data.filter((categoryObj) => {
                return categoryObj._id === categoryId
            })
            console.log('这边...resultObj: ...', resultObj)
        } else {
            message.error('所属分类请求失败..')
        }
        console.log('这边最后一步.....resultObj.name: ...', resultObj[0].name)
        return resultObj[0].name
    }

        const categoryName = await this.getCategoryName(productObj)
        console.log('this.categoryName: *******', categoryName)
        // this.setState({categoryName})
    */


    get_pName_cateName = async () => {
        // 从ProductHome页面传过来
        const {categoryId, pCategoryId} = this.props.location.state[0]
        // console.log('categoryId, pCateGoryId', categoryId, pCategoryId)
        if (categoryId === "0") {
            const pResult = await reqCategoryName(pCategoryId)
            const pCategoryName = pResult.data.name
            this.setState({pCategoryName})
        } else {
            // 不是同步发送,效率不高
            /*const pResult = await reqCategoryName(pCategoryId)
            const result = await reqCategoryName(categoryId)
            const pCategoryName = pResult.data.name
            const categoryName = result.data.name
            */

            const results = await Promise.all([
                reqCategoryName(pCategoryId),
                reqCategoryName(categoryId)
            ])
            const pCategoryName = results[0].data.name
            const categoryName = results[1].data.name
            this.setState({pCategoryName, categoryName})
        }
    }

    async componentDidMount() {
        // 初始化 parentName 与 categoryName
        await this.get_pName_cateName()
    }

    render() {
        const {name, desc, price} = this.props.location.state[0]

        const curPage = this.props.location.state[1]

        const title =
            <div>
                <ArrowLeftOutlined onClick={() => {
                    // this.props.history.goBack()
                    this.props.history.push('/product', curPage)
                }} style={{fontSize: "18px", color: "green", marginRight: '10px'}}/>
                <span>商品详情</span>
            </div>


        const {pCategoryName, categoryName} = this.state

        return (
            <Card title={title}>
                <List
                    style={{textAlign: 'left'}}
                    className='Detail-List'
                    size="large"
                    // header={<div>Header</div>}
                    // footer={<div>Footer</div>}
                    // bordered
                    // dataSource={data}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                >
                    <List.Item>
                        <div>
                            <span className='Detail-LeftTitle'>商品名称:</span>
                            <span>{name}</span>
                        </div>
                    </List.Item>
                    <List.Item>
                        <div>
                            <span className='Detail-LeftTitle'>商品描述:</span>
                            <span>{desc}</span>
                        </div>

                    </List.Item>
                    <List.Item>
                        <div>
                            <span className='Detail-LeftTitle'>商品价格:</span>
                            <span>{price}元</span>
                        </div>

                    </List.Item>
                    <List.Item>
                        <div>
                            <span className='Detail-LeftTitle'>所属分类:</span>
                            <span>{categoryName === '' ? pCategoryName : pCategoryName + " -> " + categoryName}</span>
                        </div>

                    </List.Item>
                    <List.Item>
                        <div>
                            <span className='Detail-LeftTitle'>商品图片:</span>
                            <img className='img' src={img} alt=""/>
                            <img className='img' src={img} alt=""/>
                        </div>

                    </List.Item>
                    <List.Item>
                        <div>
                            <span className='Detail-LeftTitle'>商品详情:</span>
                            <span
                                dangerouslySetInnerHTML={{__html: '<h1 style="color:red">{desc}</h1>'}}></span>
                        </div>
                    </List.Item>
                </List>
            </Card>
        );
    }
}

export default Detail;