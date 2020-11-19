<template>
  <div class="body">
    <div v-if="bool">
      <!-- 分类页的头部 -->
      <nav-bar :class="[navvisiable ? 'nav1' : 'nav0']">
        <div slot="left">
          <i class="iconfont icon-fanhui" @click="goback()" size="30px"></i>
        </div>
        <div slot="right">
          <van-icon
            name="star"
            v-if="!isLike"
            @click="userlike"
            size="22px"
            style="margin-left: -15px; margin-right: 10px"
          />
          <van-icon
            name="star"
            color="#ff5000"
            v-if="isLike"
            @click="userunLike"
            size="22px"
            style="margin-left: -15px; margin-right: 10px"
          />
          <van-icon name="share" size="22px" />
        </div>
      </nav-bar>
      <Scroll
        class="content"
        ref="scroll"
        :pullup="true"
        @scrollToEnd="scrollToEnd"
        :listenScroll="true"
        @scroll="_scroll"
      >
        <div>
          <!-- 轮播图 -->
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="(item, key) in swipers"
                :key="key"
              >
                <img :src="url + item.img_url" />
              </div>
            </div>
            <!-- Add Pagination:圆圈计数 -->
            <div class="swiper-pagination"></div>
          </div>
          <!-- 商品图片 -->
          <div class="imgs">
            <div><img :src="url + productone.productone.goods_img" /></div>
            <div class="p1">可选款式</div>
            <ul v-for="(item, key) in img" :key="key">
              <li><img :src="url + item.img_url" /></li>
            </ul>
          </div>
          <!-- 商品信息 -->
          <div class="productOne">
            <div class="mytitle">{{ productone.productone.title }}</div>
            <div class="info">
              <div class="priceone">
                ¥{{ productone.productone.shop_price }}
              </div>
              <div class="number">
                库存量：{{ productone.productone.goods_number }}
              </div>
            </div>
          </div>
          <div class="line"></div>
          <!-- 规格 -->
          <div class="list" @click="purchase">
            <p class="p1">规格</p>
            <p class="p2">请选择款式 尺码</p>
            <img src="@/assets/images/youjiantou2.png" />
          </div>
          <!-- 优惠券 -->
          <!-- <div class="list">
            <p class="p1">会员</p>
            <p class="p2" style="color: orange">
              使用会员红包，商品最高抵扣50元
            </p>
            <img src="@/assets/images/youjiantou2.png" />
          </div> -->
          <van-coupon-cell
            class="list"
            :coupons="coupons"
            :chosen-coupon="chosenCoupon"
            @click="showList = true"
          />
          <van-popup
            v-model="showList"
            round
            position="bottom"
            style="height: 80%; padding-top: 4px"
          >
            <van-coupon-list
              :coupons="coupons"
              :chosen-coupon="chosenCoupon"
              :disabled-coupons="disabledCoupons"
              @change="onChange"
              @exchange="onExchange"
            />
          </van-popup>
          <!-- 地址 -->
          <div class="list" @click="Toaddress">
            <p class="p1">配送</p>
            <p class="p2">六安到天津</p>
            <img src="@/assets/images/youjiantou2.png" />
          </div>
          <van-cell
            is-link
            @click="showPopup"
            class="list"
            style="border-bottom: none"
          >
            <p class="p1">服务</p>
            <div class="p2" style="top: 0px">
              商家包邮 7天内发货 7天无忧退款
            </div>
          </van-cell>
          <div class="line"></div>
          <!-- 服务说明 -->
          <van-popup
            v-model="show"
            position="bottom"
            :style="{ height: '80%' }"
          >
            <div class="severTitle">服务说明</div>
            <div class="severList">
              <i class="iconfont icon-duigou"></i>
              <div class="severContent">
                <p class="p1">商家包邮</p>
                <p class="p2">
                  商品包邮。宁夏、青海、甘肃、内蒙古、新疆、西藏、澳门、海外、香港、台湾按实际运费收取。
                </p>
              </div>
            </div>
            <div class="severList">
              <i class="iconfont icon-duigou"></i>
              <div class="severContent">
                <p class="p1">72小时免费送货</p>
              </div>
            </div>
            <div class="severList">
              <i class="iconfont icon-duigou"></i>
              <div class="severContent">
                <p class="p1">7天无忧虑退换货</p>
                <p class="p2">
                  自收到商品之日7天起，可在线申请无忧退换货服务（食品，贴身衣物，定制商品除外）
                </p>
              </div>
            </div>
          </van-popup>
          <!-- 同类推荐 -->
          <div class="recommed">
            <div class="p">同类推荐</div>
            <van-swipe :loop="false" :width="110" :show-indicators="false">
              <van-swipe-item v-for="(item, key) in categoods" :key="key">
                <router-link :to="'/productDetail/' + item._id">
                  <img :src="url + item.goods_img" />
                </router-link>
                <h6>{{ item.title }}</h6>
              </van-swipe-item>
            </van-swipe>
          </div>
          <div class="line"></div>
          <!-- 产品详情和评论tab -->
          <div>
            <van-tabs
              v-model="currentActive"
              class="datails-tabs"
              animated
              swipeable
            >
              <van-tab v-for="val in item" :title="val.title" :key="val.id">
                <div
                  v-show="currentActive == 0"
                  class="active-0"
                  v-html="productone.productone.goods_content"
                ></div>
                <div v-show="currentActive == 1" class="active-1">
                  <div v-if="dataArr.length">
                    <div class="comment" v-for="val of dataArr" :key="val._id">
                      <div class="comment-content">
                        <div class="avatar">
                          <img
                            v-if="!val.anonymous"
                            :src="val.user[0].avatar"
                            :onerror="defaultImg"
                            alt
                            srcset
                          />
                          <img v-else :src="val.comment_avatar" alt srcset />
                        </div>
                        <div class="desc border-bottom">
                          <p class="fist">
                            <span class="name" v-if="!val.anonymous"
                              >{{
                                val.user[0].nickname || val.user[0].username
                              }}：</span
                            >
                            <span class="name" v-else
                              >{{ val.nickname }}：</span
                            >
                            <span class="num">{{ val.comment_time }}</span>
                          </p>
                          <p class="timer">
                            <van-rate
                              v-model="val.rate"
                              readonly
                              :size="12"
                              color="#e0322b"
                            />
                          </p>
                          <p class="cont">{{ val.content }}</p>
                          <div
                            class="img-content"
                            :class="setImgContentClass(val.images.length)"
                          >
                            <img
                              v-for="img of val.images"
                              class="img"
                              :class="setImgClass(val.images.length)"
                              :key="img"
                              :src="url + img"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="!dataArr.length" class="nocomment">
                    该商品暂无评论噢~~
                  </div>
                </div>
              </van-tab>
            </van-tabs>
          </div>
        </div>
      </Scroll>
      <!-- 置顶 -->
      <div class="g-backtop-container">
        <me-backtop :visible="isBacktopVisible" @backtop="backToTop" />
      </div>
      <!-- 商品购买导航 -->
      <van-goods-action>
        <van-goods-action-icon
          icon="chat-o"
          text="客服"
          color="#07c160"
          @click="toMy"
        />
        <van-goods-action-icon
          icon="cart-o"
          text="购物车"
          :info="shopnum"
          @click="toLinkCart"
        />
        <van-goods-action-button
          type="warning"
          text="加入购物车"
          @click="purchase"
        />
        <van-goods-action-button
          type="danger"
          @click="nowchase"
          text="立即购买"
        />
      </van-goods-action>
      <!-- 规格 -->
      <transition name="bounce2">
        <div class="sku" v-show="showBase">
          <van-icon name="close" class="close" @click="showBase = false" />
          <div class="goods-top border-bottom">
            <img :src="url + swiper2[0].img_url" class="image_path" />
            <div class="goods-right">
              <p class="goods-name">{{ productone.productone.title }}</p>
              <p class="pic">
                <span>￥</span>
                <span>{{ productone.productone.shop_price * newCount }}</span>
              </p>
              <p class="goods-name">
                <span v-if="chooseContent1 != '' && chooseContent2 != ''">
                  选择的是:{{ chooseContent1 + "," + chooseContent2 }}
                </span>
                <span v-else> 请选择颜色和型号 </span>
              </p>
            </div>
          </div>
          <div class="goods-center border-bottom">
            <div class="label-title">选择商品规格</div>
            <div class="size-label-box">
              <div class="label">颜色:</div>
              <div class="label-item-box">
                <div
                  class="label-item"
                  :class="indexactive1 == key ? 'active' : ''"
                  v-for="(coloritem, key) in productone.colorResult"
                  :key="key"
                  @click="changeActive1(key)"
                >
                  {{ coloritem.color_name }}
                </div>
              </div>
            </div>
            <div class="size-label-box">
              <div class="label">尺寸:</div>
              <div class="label-item-box">
                <div
                  class="label-item"
                  :class="indexactive2 == key ? 'active' : ''"
                  v-for="(sizeitem, key) in productone.sizeResult"
                  :key="key"
                  @click="changeActive2(key)"
                >
                  {{ sizeitem.size_value }}
                </div>
              </div>
            </div>
          </div>
          <div class="goods-bottom border-bottom">
            <div class="left">
              <p class="num">购买数量：</p>
              <p class="totle">
                剩余 {{ productone.productone.goods_number }} 件
                <span>每人限购5件</span>
              </p>
            </div>
            <AdditionAndSubtraction @count="count" />
          </div>
          <div class="bottom" @click="addCart">添加到购物车</div>
          <div class="bottom" @click="PurchaseImmediately" v-if="flag">
            立即购买
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div
          class="sku-layer"
          v-show="showBase"
          @click="showBase = false"
        ></div>
      </transition>
    </div>
  </div>
</template>

<script>
import MeBacktop from "@/components/backtop";
import Vue from "vue";
import { Popup } from "vant";
Vue.use(Popup);
import { CouponCell, CouponList } from "vant";
Vue.use(CouponCell);
Vue.use(CouponList);
import storage from "@/assets/js/storage.js"; // set(),get(),remove(),clear()
import { vuexData } from "@/assets/js/mixin";
import Swiper from "swiper";
import navBar from "@/components/navbar.vue";
import config from "@/assets/js/config.js";
import AdditionAndSubtraction from "@/components/AdditionAndSubtraction";
import Scroll from "@/components/Scroll";
import { Toast } from "vant";
Vue.use(Toast);
const coupon = {
  available: 1,
  condition: "满300元可使用",
  reason: "",
  value: "15000",
  name: "优惠券名称",
  startAt: 1604062000,
  endAt: 1606665600,
  valueDesc: "150",
  unitDesc: "元",
};
export default {
  name: "productDetail",
  mixins: [vuexData],
  components: {
    navBar,
    AdditionAndSubtraction,
    Scroll,
    MeBacktop,
  },

  data() {
    return {
      showList: false,
      chosenCoupon: -1,
      coupons: [coupon],
      disabledCoupons: [coupon],
      num: 0,
      flag: false,
      swiper2: [],
      dataArr: [],
      defaultImg: "",
      comment: "",
      isLike: false,
      bool: false,
      id: null,
      swipers: [],
      url: config.api,
      productone: [],
      currentActive: 0,
      item: [
        { id: 0, title: "商品详情" },
        { id: 1, title: "商品评论" },
      ],
      showBase: false, // 显示sku
      newCount: 1,
      indexactive1: null,
      indexactive2: null,
      chooseContent1: "",
      chooseContent2: "",
      img: [],
      cate_id: "",
      categoods: [],
      navvisiable: false,
      show: false,
      isBacktopVisible: false,
    };
  },
  methods: {
    onChange(index) {
      this.showList = false;
      this.chosenCoupon = index;
    },
    onExchange(code) {
      this.coupons.push(coupon);
    },
    _scroll(pos) {
      // console.log(pos.y);
      this.navvisiable = pos.y < 0 && -pos.y > 320;
      this.isBacktopVisible = pos.y < 0 && -pos.y > 200; //通过指定坐标范围来实现backtop子组件的显示隐藏
    },
    backToTop() {
      this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0);
    },
    showPopup() {
      this.show = true;
    },
    async nowchase() {
      this.flag = true;
      this.showBase = true; // 规格弹层打开
    },
    // 立即购买
    PurchaseImmediately() {
      if (!this.token) {
        this.$router.push("/login");
        return;
      }
      let goods = [
        {
          check: true,
          num: this.newCount,
          id: this.id,
          goods_img: this.productone.productone.goods_img,
          mallPrice: this.productone.productone.market_price * this.newCount,
          market_price: this.productone.productone.market_price,
          title: this.productone.productone.title,
          idDirect: true, // 重要重要重要(判断是否是从立即购买中来的)
          color: this.productone.colorResult[this.indexactive1]._id,
          size: this.productone.sizeResult[this.indexactive2]._id,
        },
      ];
      this.$router.push("/confirmOrder");
      this.setShopList(goods); // 重要重要重要  shopOrderList
    },
    async getColorSwiper2() {
      //console.log(this.productone.colorResult[this.indexactive1]._id, this.id);
      let res = await this.Api.getImageStore(
        this.productone.colorResult[this.indexactive1]._id,
        this.id
      );
      this.swiper2 = res.data.data;
      console.log(this.swiper2);
    },
    setImgClass(len) {
      return `img${len}`;
    },

    setImgContentClass(len) {
      return `img-content${len}`;
    },

    scrollToEnd() {
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 20);
      // 评论分页
      if (this.currentActive == 1) {
        if (this.dataArr.length >= 5) {
          this.page++;
          if (this.hasMore()) {
            this.goodsItem(this.id, true);
          } else {
            this.$toast("没有更多评论了~~");
          }
        }
      }
    },
    async userIsLike() {
      var res = await this.Api.userIsLike(this.id);
      console.log(res);
      if (res.data.success) {
        this.isLike = true;
      } else {
        this.isLike = false;
      }
    },
    async userlike() {
      if (!storage.get("userName")) {
        this.$dialog
          .alert({
            message: "您尚未登录",
            className: "zindex",
          })
          .then(() => {
            this.$router.push("/login");
          });
      } else {
        let res = await this.Api.userLike(this.id, this.userName._id);
        if (res.data.success) {
          this.isLike = true;
        }
        Toast("收藏成功！");
      }
    },
    async userunLike() {
      if (!storage.get("userName")) {
        this.$dialog
          .alert({
            message: "您尚未登录",
            className: "zindex",
          })
          .then(() => {
            this.$router.push("/login");
          });
      } else {
        let res = await this.Api.userunLike(this.id, this.userName._id);
        if (res.data.success) {
          this.isLike = false;
        }
        Toast("取消收藏！");
      }
    },
    toLinkCart() {
      this.$router.push("/cart");
    },
    toMy() {
      this.$router.push("/my");
    },
    Toaddress() {
      this.$router.push("/Address");
    },
    async addCart() {
      if (this.chooseContent1 == "" || this.chooseContent2 == "") {
        this.$toast({ message: "你没选择颜色或者型号", className: "zindex" });
      } else {
        this.showBase = false;
        //  本地存储实现添加到购物车
        // 1.从本地存储中获得 商品数据 addGoods 数据
        if (!storage.get("token")) {
          let bool = true;
          this.addGoods = storage.get("addGoods") || [];

          for (var i = 0; i < this.addGoods.length; i++) {
            let item = this.addGoods[i];
            if (
              item.id == this.productone.productone._id &&
              item.color ==
                this.productone.colorResult[this.indexactive1]._id &&
              item.size == this.productone.sizeResult[this.indexactive2]._id
            ) {
              // 修改商品数量
              var newAddGoodOne = {
                id: item.id,
                num: item.num + this.newCount, //获得数量的值
                color: this.productone.colorResult[this.indexactive1]._id,
                size: this.productone.sizeResult[this.indexactive2]._id,
                check: false,
              };
              this.addGoods.splice(i, 1); //删除旧数据
              this.addGoods.push(newAddGoodOne); //在添加修改的数据
              bool = false;
            }
          }
          //  b.如果没有直接添加商品信息
          if (bool) {
            // 添加新商品
            var newAddGoodOne = {
              id: this.productone.productone._id,
              num: this.newCount,
              color: this.productone.colorResult[this.indexactive1]._id,
              size: this.productone.sizeResult[this.indexactive2]._id,
              check: false,
            };
            this.addGoods.push(newAddGoodOne);
          }
          // (3)  将addGoods 数据  保存到本地存储中
          storage.set("addGoods", this.addGoods);
          this.addGoods = storage.get("addGoods") || [];
          if (!storage.get("token")) {
            let sum = 0;
            for (var key in this.addGoods) {
              sum += this.addGoods[key].num;
            }
            this.setShopnum(sum); //徽标数量更改
          }
        }
        if (storage.get("token")) {
          //  size,color,id
          this.Api.addShop(
            this.userName._id,
            this.id,
            this.newCount,
            false,
            this.productone.colorResult[this.indexactive1]._id,
            this.productone.sizeResult[this.indexactive2]._id
          );
          const { data } = await this.Api.getShop(this.userName._id);
          this.setShopnum(data.totalNumber + this.newCount); //徽标数量更改
        }
      }
    },
    changeActive1(key) {
      this.indexactive1 = key;
    },
    changeActive2(key) {
      this.indexactive2 = key;
    },
    // 立即购买弹出sku
    purchase() {
      this.showBase = true;
    },
    count(newCount) {
      this.newCount = newCount; // 子组件中拿到的数量
    },
    async getProductOne() {
      if (!this.productOnes[this.id]) {
        //vuex中this.productOnes[this.id]是否存在,不存在调ajax并且存入vuex中
        let res = await this.Api.goodsDetail(this.id);
        this.productone = res.data.data; //  当前商品信息:this.productone.productone
        this.cate_id = this.productone.productone.cate_id;
        this.getCateidGoods(this.cate_id);
        this.img = this.productone.goodsImageResult;
        this.dataArr = res.data.data.comment;
        this.bool = true; //手段为了让 ajax 拿到数据，然后渲染标记。
        this.productOneAction({
          // 以前访问： this.$store.dispatch('productOneAction,{data,id})
          data: this.productone,
          id: this.id,
        }); // 调用productionOneAction方法拿到接口数据
      } else {
        console.log("获得缓存信息");
        this.productone = this.productOnes[this.id];
        this.dataArr = this.productone.comment;
        this.bool = true;
      }
      this.swipers = this.productone.goodsImageResult;
      this.swiper2 = this.productone.goodsImageResult;
      console.log(this.swipers, this.swiper2);
      this.$nextTick(() => {
        new Swiper(".swiper-container", {
          pagination: {
            // 圆圈
            el: ".swiper-pagination",
          },
          loop: true, // 循环
          autoplay: {
            delay: 2500, // 每隔2.5秒播放一张图
            disableOnInteraction: false, // true默认手动轮播停止后，自动播放会停止
            // 设置 为 false ,手动轮播停止后，自动播放继续使用
          },
        });
      });
    },
    // 同类商品
    async getCateidGoods(id) {
      console.log(id);
      let res = await this.Api.getCateidGoods(id);
      console.log(res.data.data);
      if (res.data.success) {
        this.categoods = res.data.data;
      } else {
        this.categoods = [];
      }
    },
  },
  created() {
    this.id = this.$route.params.id; //接收的动态传值的键对应的值
    if (storage.get("userName")) {
      this.userIsLike();
    }
  },
  mounted() {
    this.getProductOne();
    this.ChangTabbarShow(false);
  },
  destroyed() {
    this.ChangTabbarShow(true);
  },
  watch: {
    indexactive1() {
      this.chooseContent1 = this.productone.colorResult[
        this.indexactive1
      ].color_name;
      this.getColorSwiper2();
    },
    indexactive2() {
      this.chooseContent2 = this.productone.sizeResult[
        this.indexactive2
      ].size_value;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: fixed; /*可视高度*/
  top: 1px;
  left: 0;
  right: 0;
  bottom: 60px;
  overflow: hidden;
  background-color: white;
}
.nav0 {
  height: 60px;
  background-color: rgba(0, 0, 0, 0);
  color: white;
}
.nav1 {
  background-color: white;
  color: rgb(122, 117, 117);
}
/*轮播图样式*/
.swiper-container {
  width: 100%;
  height: 375px;
}
.swiper-container img {
  width: 100%;
  height: 100%;
}
.router-link-active {
  color: #f60;
}
/*产品详情页*/
.productInfo {
  display: flex;
  height: 35px;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  margin: 6px 0;
  background: #fff;
  border-bottom: 1px solid #ccc;
}
.productInfo li {
  flex: 1;
}
.productInfo li:nth-of-type(1) {
  border-right: 1px solid #ccc;
}
// 商品图片
.imgs {
  width: 90%;
  height: auto;
  margin: 20px auto;
  border-bottom: 1px solid grey;
  display: flex;
  padding-bottom: 10px;
}
.imgs img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.imgs .p1 {
  width: 50px;
  height: 50px;
  margin: auto 10px;
  font-size: 20px;
  text-align: center;
  color: rgb(88, 86, 86);
}

/*商品信息*/
.productOne > div {
  padding: 0px 20px;
}
.mytitle {
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 1;
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font: 700 20px 微软雅黑；;
}
.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 7px;
}
.info .priceone {
  color: #f00;
  font: 500 25px 微软雅黑；;
  padding-bottom: 7px;
}
.info .number {
  color: #aaa;
  font: 12px arial；;
}
.brand {
  color: #333;
  font: 12px arial；;
}
.line {
  width: 100%;
  height: 10px;
  background-color: rgb(248, 247, 247);
}
// 规格
.list {
  width: 90%;
  height: auto;
  border-bottom: 1px solid lightgrey;
  display: flex;
  margin: 0 auto;
  padding: 10px 0;
  position: relative;
}
.list p {
  font-size: 15px;
  font-weight: 400;
}
.list .p1 {
  color: #333;
  width: 15%;
}
.list .p2 {
  position: absolute;
  left: 17%;
  display: flex;
  width: 83%;
  color: black;
}
.list .p3 {
  width: 32%;
}
.list img {
  width: 17px;
  height: 17px;
  position: absolute;
  right: 0;
}
// 服务说明
.severTitle {
  width: 40%;
  height: auto;
  margin: 15px auto;
  text-align: center;
  color: red;
  font-size: 20px;
}
.severList {
  width: 90%;
  height: auto;
  margin: 15px auto;
  display: flex;
}
.severList i {
  color: red;
  margin-right: 10px;
  margin-top: 3px;
}
.severList .p1 {
  color: black;
  font-size: 15px;
  margin-bottom: 8px;
}
.severList .p2 {
  color: grey;
  font-weight: 400;
  font-size: 15px;
}
// 同类推荐
.recommed {
  width: 90%;
  height: 150px;
  margin: 0 auto;
  display: flex;
  padding: 10px 0;
}
.recommed .p {
  width: 5%;
  height: auto;
  margin-right: 8%;
  font-size: 18px;
  color: rgb(100, 100, 100);
  margin-top: 15px;
}
.recommed img {
  width: 100px;
  height: 100px;
}
.recommed h6 {
  text-align: center;
  font-size: 17px;
  margin-top: 5px;
}
.active-0 {
  width: 100%;
  // border: 1px solid red;
  padding-left: 35px;
  display: inline-table;
}
.active-0 .img p img {
  width: 100%;
}
.sku {
  height: 400px;
  background: #fff;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  .close {
    position: absolute;
    right: 0%;
    top: 0%;
    font-size: 18px;
    z-index: 200;
    padding: 10px;
  }
  .goods-top {
    position: relative;
    height: 90px;
    display: flex;
    .image_path {
      flex: 0 0 80px;
      transform: translate3d(16px, -10px, 0);
      width: 80px;
      height: 80px;
      border: 1px solid #eee;
    }
    .goods-right {
      padding-left: 30px;
      flex: 1;
      .goods-name {
        font-size: 14px;
        margin-top: 10px;
        padding-right: 35px;
        line-height: 1.4;
      }
      .pic {
        margin-top: 10px;
        color: #ff4444;
        font-size: 14px;
      }
    }
  }
  .goods-bottom {
    height: 70px;
    padding: 10px 16px 10px 16px;
    box-sizing: border-box;
    display: flex;
    .left {
      flex: 0 0 60%;
      width: 60%;
      .num {
        font-size: 12px;
      }
      .totle {
        margin-top: 15px;
        color: #999;
        font-size: 12px;
        span {
          color: #f44;
          margin-left: 10px;
          font-size: 12px;
        }
      }
    }
  }
  .bottom {
    height: 50px;
    background: #f44;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    color: #fff;
    letter-spacing: 2px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.sku-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}
.goods {
  padding-bottom: 50px;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  // overflow: auto;
  &-swipe {
    img {
      width: 100%;
      height: 400px;
      display: block;
    }
  }
  &-title {
    font-size: 16px;
  }
  &-price {
    color: #f44;
  }
  &-express {
    color: #999;
    font-size: 12px;
    padding: 5px 15px;
  }
  &-cell-group {
    margin: 15px 0;
    .van-cell__value {
      color: #999;
    }
  }
  &-tag {
    margin-left: 5px;
  }
}

.active-1 {
  min-height: 300px;
}

.label-title {
  padding-left: 10px;
  font-size: 14px;
  font-weight: bold;
}
.size-label-box .label {
  font-size: 13px;
  color: #000;
  padding-left: 15px;
  padding: 15px 0 10px 15px;
}
.size-label-box .label-item-box {
  display: flex;
  margin-left: 15px;
  flex-direction: row;
  flex-wrap: wrap;
}
.size-label-box .label-item {
  font-size: 13px;
  color: #000;
  padding: 7px 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin: 0 10px 10px 0;
}
.size-label-box .label-item.active {
  color: #e64340;
  border: 1px solid #e64340;
}

.comment {
  margin-top: 15px;
  .comment-content {
    display: flex;
    margin: 12px;
    &-first-child {
      margin-top: 50px;
    }
    .avatar {
      flex: 0 0 35px;
      width: 35px;
      margin-right: 20px;
      img {
        width: 38px;
        height: 38px;
        border: 1px solid #eee;
        border-radius: 50%;
      }
    }
    .desc {
      flex: 1;
      padding-bottom: 8px;
      display: flex;
      flex-direction: column;
      &-last-child::before {
        border: 0;
      }
      .fist {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .name {
          font-size: 14px;
          olor: grey;
        }
        .num {
          color: gray;
          font-size: 14px;
        }
      }
      .timer {
        color: grey;
        margin-top: 8px;
      }
      .cont {
        margin-top: 8px;
        color: #333;
        overflow: hidden;
        word-wrap: break-word;
        word-break: break-all;
        text-align: justify;
        font-size: 14px;
        line-height: 1.6;
      }
      .img-content {
        display: flex;
        width: 100%;
        flex-wrap: wrap;

        .img {
          flex: 0 0 80px;
          width: 90px;
          flex-wrap: wrap;
          object-fit: cover;
          height: 90px;
          border-radius: 3px;
          margin-bottom: 5px;
          margin-right: 6px;
        }
        .img1 {
          flex: 1;
          height: 200px;
          margin-top: 10px;
        }
        .img2 {
          flex: 0 0 49%;
          height: 110px;
          margin: 0;
          margin-top: 10px;
        }
      }
    }
  }
}
.like {
  position: relative;
  display: flex;
  align-items: center;
  .like-o {
    font-size: 20px;
    position: absolute;
    right: 35%;
  }
  .like2 {
    font-size: 20px;
    position: absolute;
    right: 8%;
    color: red;
  }
}
.nocomment {
  text-align: center;
  color: #333;
  margin-top: 50px;
}
.van-tab__text--ellipsis {
  font-size: 17px;
  font-weight: 700;
}
</style>
