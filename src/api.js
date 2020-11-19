import axios from './assets/js/axios'
// 所有接口的api封装
export default class Api {
    /**
     * 首页(Home)所有接口
     * recommend            首页的默认数据
     *
     *
     */
    static recommend(page) {
        return axios(`/api/index/items/is_best?page=${page}`, 'get')
    }
    // 热销商品
    static hot(page) {
        return axios(`/api/index/items/is_hot?page=${page}`, 'get')
    }
    // 其他分类的所有商品
    static else() {
        return axios(`/api/else`, 'get')
    }
    // 轮播图
    static carousels() {
        return axios('/api/index/carousels', 'get')
    }
    // ===============================================================================================================
    /**
     * 产品详情页
     * 通过商品_id查询  参数itemId
     */
    static goodsDetail(id) {
        return axios(`/api/items/searchById?itemId=${id}`, 'get')
    }

    /**
     * 产品分类
     * /cats
     * /items/searchByCat
     */
    static getCate() {
        return axios('/api/cats', 'get')
    }
    // 所有商品
    static getGoods(orderBy) {
        return axios(`/api/catss?orderBy=${orderBy}`, 'get')
    }
    // 同类商品
    static getCateidGoods(id) {
        return axios(`/api/items/cateidgoods?cateId=${id}`, 'get')
    }
    // 某个分类的所有商品
    static getGoodsByCate(id, orderBy) {
        return axios(`/api/items/searchByCat?catId=${id}&orderBy=${orderBy}`, 'get')
    }
    // 所有热销类商品和分类名称
    static catesAndGoodsHot() {
        return axios('/api/catesAndGoodsHot', 'get')
    }
    // 所有商品和分类名称
    static catesAndGoods() {
        return axios('/api/catesAndGoods', 'get')
    }
    /**
    * 搜索商品
    * /index/search
    * 
    */
    static search(keyword, orderBy) {
        return axios(`/api/index/search?keyword=${keyword}&orderBy=${orderBy}`, 'get')
    }
    /**
   *通过多个 id 查找多个商品
   *  
   */
    static getProducts(ids) {
        return axios(`/api/item/queryItems?itemIds=${ids}`, 'get')
    }
    // 通过color的id号找对应图库的图
    static getImageStore(_id, goodsId) {
        return axios(`/api/getImageStore?_id=${_id}&goodsId=${goodsId}`, 'get')
    }
    // 获得颜色和尺寸的值
    static getColorSize() {
        return axios(`/api/getColorSize`, 'get')
    }
    /* 登录或注册的接口*/
    static login(phone, password, verify,) {
        return axios('/api/login', 'post', {
            phone,
            password,
            verify
        })
    }

    /* 验证码接口*/
    static getAverify() {
        return `/api/verify?mt=${Math.random()}`
    }
    /**
     * 会员中心(My)所有接口
     * loginOut 退出登录
     * user     获取用户信息
     * saveUser 修改保存用户信息
     * 
     */
    static loginOut() {
        return axios(`/api/loginOut`)
    }

    static user(_id) {
        return axios(`/api/queryUser?_id=${_id}`)
    }

    static saveUser({ ...args }) {
        return axios(`/api/saveUser`, 'post', args)
    }

    /*会员操作*/
    // 1. 收藏
    static userIsLike(itemId) {
        return axios(`/api/item/userIsLike?itemId=${itemId}`, 'post')
    }
    static userLike(itemId) {
        return axios(`/api/item/like?itemId=${itemId}`, 'post')
    }

    static userunLike(itemId) {
        return axios(`/api/item/unlike?itemId=${itemId}`, 'post')
    }

    static getCollection(page) {
        return axios(`/api/items/goodsFavList?page=${page}`, 'post')
    }

    //  评论


    static comment({ ...args }) {
        return axios(`/api/goodsOne/comment`, 'post', args)
    }

    static alreadyEvaluated(_id, page = 1) {
        return axios(`/api/alreadyEvaluated?page=${page}&_id=${_id}`, 'post')
    }

    static tobeEvaluated(_id, page = 1) {
        return axios(`/api/tobeEvaluated?page=${page}&_id=${_id}`, 'post')
    }

    static evaluateOne(_id) { // 评论编号id
        return axios('/api/evaluateOne', 'post', {
            _id
        })
    }
    // 购物车接口
    static getShop(_id) {
        return axios(`/api/getShop?_id=${_id}`, 'post')
    }

    static addShop(_id, id, num, check, color, size) {
        return axios(`/api/addShop?_id=${_id}`, 'post', { id, color, size, num, check })
    }

    static editCart(_id, num, id, check, color, size) {
        return axios(`/api/editCart?_id=${_id}`, 'post', {
            num,
            id,
            check,
            color,
            size
        })
    }

    static deleteShop(_id, id, color, size) {
        return axios(`/api/deleteShop?_id=${_id}`, 'post', { id, color, size })
    }

    // 地址管理
    static getAddress(uid) {
        return axios(`/api/getAddress?uid=${uid}`, 'get')
    }

    static getDefaultAddress(uid) {
        return axios(`/api/getDefaultAddress?uid=${uid}`, 'get')
    }

    static setDefaultAddress(id, uid) {
        return axios(`/api/setDefaultAddress?uid=${uid}`, 'post', { id })
    }

    static postAddress({ ...args }) {
        return axios(`/api/address`, 'post', args)
    }

    static deleteAddress(id, uid) {
        return axios(`/api/deleteAddress?uid=${uid}`, 'post', {
            id
        })
    }

    //生成訂單

    // ===============================================================================================================
    /**
     * 购物车支付页面(ShoppingPayMent)所有接口
     * placeOrder 提交订单 参数：address:收货地址,tel:电话，orderId：所有商品的id，totalPrice：总价格,idDirect:用来判断是购物车结算还是直接购买,count:商品数量
     */
    static placeOrder({ ...args }) {
        return axios('/api/order', 'post', args)
    }

    static getMyOrder(uid) {
        return axios(`/api/myOrder?uid=${uid}`, 'get')
    }
    static getOrderNum(uid) {
        return axios(`/api/orderNum?uid=${uid}`, 'get')
    }
    /*
       支付管理
    */
    static confirm(id) {
        return axios(`/api/confirm?id=${id}`, 'get')
    }
    static alipaypay(order_id) {
        return axios(`/api/alipay/pay?order_id=${order_id}`, 'get')
    }
    static alipayReturn() {
        return axios(`/api/alipay/alipayReturn`, 'get')
    }

    static changeOrderInfo(order_id) {
        return axios(`/api/alipay/changeOrderInfo?order_id=${order_id}`, 'get')
    }
    // /api/alipay/orderchangeToFinished2

    static orderchangeToFinished2(_id) {
        return axios(`/api/alipay/orderchangeToFinished2?orderId=${_id}`, 'get')
    }

}