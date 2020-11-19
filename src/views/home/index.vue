<template>
  <div class="body">
    <!-- navbar 导航 -->
    <nav-bar :class="[navvisiable ? 'nav1' : 'nav0']">
      <div slot="left" class="lefticon">
        <van-icon name="scan" size="25px" />
      </div>
      <div slot="center" class="search">
        <i class="iconfont icon-sousuo"></i>
        <input
          type="text"
          placeholder="商品5折"
          class="keybox"
          @click="goToSearch"
        />
      </div>
      <div slot="right" class="rightlogin">
        <van-icon name="shopping-cart-o" size="25px" @click="toCart" />
        <van-icon
          name="service-o"
          size="25px"
          style="margin: 3px"
          @click="toMy"
        />
      </div>
    </nav-bar>

    <!--  :pullup="true" 是否启用上拉加载  ;@scrollEnd="scrollToEnd" 触发上拉加载-->
    <!-- :data="dataArr"  分页的数据，将来获得新的滚动数据的高度-->
    <!--  class="content" 滚动出不来,去看scrollHeight(高),wrapperHeight .content {
                  position: fixed; /*可视高度*/
                  top: 60px;
                  left: 0;
                  right: 0;
                  bottom: 60px;
                  overflow: hidden;
    }-->
    <!-- :listenScroll="true" 是否启用滚动scroll事件 ; @scroll="_scroll"触发scroll事件 ;配置:probeType="3"-->
    <Scroll
      :pullup="true"
      @scrollEnd="scrollToEnd"
      :data="dataArr"
      class="content"
      ref="scroll"
      :listenScroll="true"
      @scroll="_scroll"
      :probeType="3"
    >
      <div class="content-scroll">
        <van-pull-refresh
          v-model="isLoading"
          :head-height="80"
          @refresh="onRefresh"
        >
          <!-- 下拉提示，通过 scale 实现一个缩放效果 -->
          <img
            class="doge"
            slot="pulling"
            slot-scope="props"
            src="@/assets/images/xiong.png"
            rel="external nofollow"
            :style="{ transform: `scale(${props.distance / 80})` }"
          />
          <!-- 释放提示 -->
          <img
            class="doge"
            slot="loosing"
            src="@/assets/images/xiong.png"
            rel="external nofollow"
          />
          <!-- 加载提示 -->
          <img
            class="doge"
            slot="loading"
            src="@/assets/images/xiong.png"
            rel="external nofollow"
          />

          <!-- 轮播图 -->
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="(item, key) in swipers"
                :key="key"
              >
                <img :src="url + item.focus_img" />
              </div>
            </div>
            <!-- Add Pagination:圆圈计数 -->
            <div class="swiper-pagination"></div>
          </div>
          <!-- 喇叭 -->
          <div class="small-title">
            <img src="@/assets/images/喇叭.png" alt="" />
            <marquee direction="left" scrollamount="1" scrolldelay="60">
              <h5>
                亲爱的顾客：十一期间不打烊，可正常下单，
                发货时效因假期原因延长至3-8天，若紧急情况需要急发，
                10月4日开始可发顺丰，运费自理。特此公告，感谢您的谅解，
                祝你购物愉快！
              </h5>
            </marquee>
          </div>
          <!-- 二级导航效果 -->
          <div class="sec-nav">
            <ul class="secondNav">
              <li
                class="item"
                v-for="(item, key) in navs"
                :key="key"
                @click="tabClick(item)"
              >
                <p>
                  <img :src="url + item.cate_img" />
                </p>
                <p>{{ item.title }}</p>
              </li>
            </ul>
            <div class="item2" @click="goToCategory">
              <p class="all-fenlei">
                <img src="@/assets/images/全部分类.png" alt="" />
              </p>
              <p>全部分类</p>
            </div>
          </div>
          <!-- 实时热销版 -->
          <div class="hot-sale">
            <ul class="title">
              <li>
                <img src="@/assets/images/huangguan.png" style="width: 100%" />
              </li>
              <li style="margin-right: 44%; margin-top: 2%">实时热销版</li>
              <li>
                <img
                  src="@/assets/images/youjiantou.png"
                  style="width: 70%; margin-top: 20%"
                  @click="goToHotsale"
                />
              </li>
            </ul>
            <div class="goods">
              <van-swipe :loop="false" :width="100" :show-indicators="false">
                <van-swipe-item v-for="(item, key) in hotArr" :key="key">
                  <router-link :to="'/productDetail/' + item._id">
                    <img :src="url + item.goods_img" />
                  </router-link>
                  <h6>{{ item.title }}</h6>
                </van-swipe-item>
              </van-swipe>
            </div>
          </div>
          <!-- 两个小模块 -->
          <div class="model">
            <ul>
              <li class="model" style="float: left">
                <p>婚前必买清单</p>
                <p>婚礼倒计时30天必看</p>
                <div
                  class="go"
                  style="background-color: #605baf"
                  @click="goToModel1"
                >
                  GO
                  <img src="@/assets/images/san.png" alt="" />
                </div>
                <img src="@/assets/images/banshouli .png" alt="" />
              </li>
              <li class="model" style="float: right">
                <p>酒店婚礼必备</p>
                <p>小预算必看攻略</p>
                <div
                  class="go"
                  style="background-color: #cc655c"
                  @click="goToModel2"
                >
                  GO
                  <img src="@/assets/images/san.png" alt="" />
                </div>
                <img src="@/assets/images/xi.png" alt="" />
              </li>
            </ul>
          </div>
          <!-- 推荐商品 :http://app.yiqigoumall.com/index/items/is_best  -->
          <div class="recommend">
            <van-swipe
              :loop="false"
              :width="80"
              class="title"
              :show-indicators="false"
            >
              <van-swipe-item>
                <h3 @click="changeAllGoods" :class="[list ? 'van1' : '']">
                  全部
                </h3>
              </van-swipe-item>
              <van-swipe-item
                class="van"
                v-for="(item, key) in navs"
                :key="key"
                @click="switchTab(item)"
                :class="[list ? '' : { active: item._id == index }]"
              >
                <h3 @click="changeOneGoods">
                  {{ item.title }}
                </h3>
              </van-swipe-item>
            </van-swipe>
            <div v-if="list == 1">
              <ul class="listStyle">
                <li :class="orderBy == '' ? 'active' : ''" @click="filter('')">
                  综合
                </li>
                <li
                  @click="filter('click_count')"
                  :class="orderBy == 'click_count' ? 'active' : ''"
                >
                  销量
                </li>
                <li
                  @click="filter('market_price')"
                  :class="orderBy == 'market_price' ? 'active' : ''"
                >
                  价格
                </li>
                <li
                  @click="filter('sort')"
                  :class="orderBy == 'sort' ? 'active' : ''"
                >
                  排序
                </li>
              </ul>
              <ul class="list">
                <li
                  class="recommend-item"
                  v-for="(item, key) in contents1"
                  :key="key"
                >
                  <router-link :to="'/productDetail/' + item._id">
                    <div class="imgs">
                      <img :src="url + item.goods_img" alt />
                    </div>
                    <p class="title">{{ item.title }}</p>
                    <p class="info">
                      <span class="price">¥{{ item.market_price }}</span>
                      <span class="count">点击量{{ item.click_count }}</span>
                    </p>
                  </router-link>
                </li>
              </ul>
            </div>
            <div v-else>
              <ul class="listStyle">
                <li :class="orderBy == '' ? 'active' : ''" @click="filter('')">
                  综合
                </li>
                <li
                  @click="filter('click_count')"
                  :class="orderBy == 'click_count' ? 'active' : ''"
                >
                  销量
                </li>
                <li
                  @click="filter('market_price')"
                  :class="orderBy == 'market_price' ? 'active' : ''"
                >
                  价格
                </li>
                <li
                  @click="filter('sort')"
                  :class="orderBy == 'sort' ? 'active' : ''"
                >
                  排序
                </li>
              </ul>
              <ul class="list">
                <li
                  class="recommend-item"
                  v-for="(item, key) in contents"
                  :key="key"
                >
                  <router-link :to="'/productDetail/' + item._id">
                    <div class="imgs">
                      <img :src="url + item.goods_img" alt />
                    </div>
                    <p class="title">{{ item.title }}</p>
                    <p class="info">
                      <span class="price">¥{{ item.market_price }}</span>
                      <span class="count">点击量{{ item.click_count }}</span>
                    </p>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </van-pull-refresh>
      </div>
    </Scroll>
    <div class="g-backtop-container">
      <me-backtop :visible="isBacktopVisible" @backtop="backToTop" />
    </div>
  </div>
</template>

<script>
import MeBacktop from "@/components/backtop";
import { vuexData, page } from "@/assets/js/mixin";
import Scroll from "@/components/Scroll";
import navBar from "@/components/navbar.vue";
import Swiper from "swiper"; //安装模块和导入
import config from "@/assets/js/config.js";
import storage from "@/assets/js/storage.js";
import Vue from "vue";
import { PullRefresh } from "vant";
Vue.use(PullRefresh);
import { Toast } from "vant";
Vue.use(Toast);
export default {
  name: "home",
  mixins: [vuexData, page],
  components: {
    navBar,
    Scroll,
    MeBacktop,
  },
  data() {
    return {
      isLoading: false,
      swipers: [],
      navs: [],
      contents: [],
      contents1: [],
      list: 1,
      hotArr: [],
      url: config.api,
      page: 1,
      index: "",
      isBacktopVisible: false,
      navvisiable: false,
      background: false,
      orderBy: "click_count",
    };
  },
  methods: {
    tabClick(item) {
      storage.set("categoryId", item._id);
      this.$router.push("/category");
    },
    onRefresh() {
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;
      }, 1000);
    },
    changeAllGoods() {
      this.list = 1;
    },
    changeOneGoods() {
      this.list = 0;
    },
    toCart() {
      this.$router.push("/cart");
    },
    toMy() {
      this.$router.push("/my");
    },
    goToSearch() {
      this.$router.push("/search");
    },
    goToCategory() {
      this.$router.push("/category");
    },
    goToHotsale() {
      this.$router.push("/hot-sale");
    },
    goToModel1() {
      this.$router.push("/model1");
    },
    goToModel2() {
      this.$router.push("/model2");
    },
    _scroll(pos) {
      // console.log(pos.y);
      this.isBacktopVisible = pos.y < 0 && -pos.y > 200; //通过指定坐标范围来实现backtop子组件的显示隐藏
      this.navvisiable = pos.y < 0 && -pos.y > 160;
    },
    backToTop() {
      this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0);
    },
    scrollToEnd() {
      if (this.dataArr.length >= 2) {
        if (this.hasMore()) {
          // ?算法在哪判断是否所有数据加载完了吗
          this.page++;
          this.recommend(true);
        } else {
          this.$toast("没有很多数据了~~");
        }
      }
    },
    //调用swiper方法
    async getSwiper() {
      let res = await this.Api.carousels();
      console.log(res.data.data);
      if (res.data.success) {
        this.swipers = res.data.data;
        this.$nextTick(() => {
          new Swiper(".swiper-container", {
            pagination: {
              el: ".swiper-pagination",
            },
            loop: true,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
          });
        });
      }
    },
    switchTab(item) {
      // 1.通过点击事件换标题
      this.index = item._id;
      // 2. 通过 分类标号找对应的商品内容
      this.getContent(this.index, "");
    },
    // 商品分类信息
    async getCate() {
      let res = await this.Api.getCate();
      console.log(res.data.data);
      if (res.data.success) {
        this.navs = res.data.data;
        this.index = this.navs[0]._id;
        // 并且找到对应的内容
        this.getContent(this.index, "");
      }
    },
    // 一个分类的全部商品
    async getContent(id, orderBy) {
      console.log(id, orderBy);
      let res = await this.Api.getGoodsByCate(id, orderBy);
      console.log(res.data.data);
      if (res.data.success) {
        this.contents = res.data.data;
      } else {
        this.contents = [];
      }
    },
    // 全部商品
    async getContents1(orderBy = "click_count") {
      let res = await this.Api.getGoods(orderBy);
      console.log(res.data.data);
      if (res.data.success) {
        this.contents1 = res.data.data;
      } else {
        this.contents1 = [];
      }
    },
    async filter(orderBy) {
      // orderBy: is_new 最新商品,click_count 销量, shop_price 价格
      console.log(orderBy);
      this.orderBy = orderBy;
      if (this.list == 1) {
        await this.getContents1(orderBy);
      } else {
        await this.getContent(this.index, orderBy);
      }
    },

    // 实施热销版
    async hot(flag) {
      let res2 = await this.Api.hot(this.page);
      console.log(res2);
      this.hotArr = res2.data.data; // 第一次加载的数据
    },
  },
  mounted() {
    this.getSwiper();
    this.getCate();
    this.getContents1();
    this.hot(false);
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
.doge {
  width: 90px;
  height: 72px;
  margin-top: 8px;
  border-radius: 4px;
}
// 顶部导航
.nav0 {
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
}
.nav1 {
  background-color: rgb(245, 245, 245);
  color: black;
}
.nav1 .lefticon {
  color: black;
}
.nav1 .rightlogin {
  color: black;
}
.rightlogin {
  margin-left: -5px;
}
/*轮播图样式*/
.swiper-container {
  width: 100%;
  height: 200px;
}
.swiper-container img {
  width: 100%;
  height: 100%;
}
.lefticon .iconfont {
  color: white;
  font-size: 22px;
}
.rightlogin {
  color: white;
  cursor: pointer;
  font-size: 16px;
}
.search {
  position: relative;
  display: flex;
  height: 38px;
  margin: 0 14px 0 2px;
}
.search .iconfont {
  position: absolute;
  left: 15px;
  top: 12px;
}
.keybox {
  flex: 1;
  height: 38px;
  background: #fff;
  border-radius: 6px;
  padding-left: 50px;
  color: #666;
  border: 1px solid black;
}
// 喇叭
.small-title {
  width: 90%;
  height: 100%;
  margin: 2% 5% 0% 5%;
  position: relative;
}
.small-title img {
  width: 25px;
}
.small-title marquee {
  position: absolute;
  top: 0;
  left: 9%;
}
.small-title h5 {
  color: red;
}

/*二级导航样式*/
.sec-nav {
  position: relative;
}
.secondNav {
  display: flex; /*默认行显示*/
  flex-wrap: wrap; /*允许折行*/
  width: 72%;
  height: 100px;
  overflow: hidden;
  margin: 0 0 0 5%;
  padding-top: 1.5%;
}
.item2 {
  width: 16%;
  position: absolute;
  right: 5%;
  top: 10%;
}
.item {
  width: 23%;
  display: flex;
  margin: 0 1%;
  flex-direction: column; /*列显示*/
  align-items: center; /*水平对齐*/
  padding: 4px 0;
}
.item img {
  border-radius: 50%;
  width: 100%;
}
.item2 img {
  border-radius: 50%;
  width: 100%;
}
.item p:nth-of-type(2) {
  font-size: 13px;
  padding-top: 5px;
}
.item2 p:nth-of-type(2) {
  font-size: 13px;
  padding-top: 5px;
}
// 实施热销版
.hot-sale {
  width: 90%;
  margin: 20px 5% 0 5%;
  height: 200px;
  // border: 1px solid red;
  border-radius: 5%;
  box-shadow: 0px -1px 2px 2px #aaa9a9;
}
.hot-sale .title {
  height: 25%;
  background: -webkit-linear-gradient(
    right,
    hsla(34, 73%, 64%, 0.918),
    // hsla(69, 71%, 51%, 0.911),
    white
  );
  border-radius: 11px 11px 0 0;
  padding: 2% 5%;
  vertical-align: middle;
}
.hot-sale ul li {
  float: left;
  margin-right: 8px;
}
.goods {
  margin: 15px 0 15px 15px;
}
.goods img {
  width: 90px;
  margin: 0 5px 7px 5px;
  border-radius: 10%;
}
.goods h6 {
  width: 85%;
  margin: 0 auto;
  height: auto;
  text-overflow: ellipsis;
  line-clamp: 1;
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  // text-align: center;
  font-size: 15px;
  font-weight: 550;
  overflow: hidden;
}
.van-swipe__indicator {
  width: 0 !important;
}
// 两个小模块
.model {
  width: 90%;
  height: 130px;
  margin: 10px auto;
  text-align: justify;
}
.model ul li {
  width: 48%;
  height: 130px;
  border-radius: 10px;
  padding: 5% 4%;
}
.model ul li p:nth-of-type(1) {
  font-weight: 700;
}
.model ul li p:nth-of-type(2) {
  font-size: 10px;
}
.model ul li .go {
  margin-top: 25%;
  width: 32%;
  height: 18%;
  text-align: center;
  border-radius: 10px;
  color: white;
  font-size: 10px;
  padding-top: 2.5%;
  padding-left: 2%;
}
.model ul li .go > img {
  width: 30%;
  height: 70%;
}
.model ul li > img {
  width: 50%;
  height: 50%;
  margin-left: 50%;
  margin-top: -25%;
}
.model ul li:nth-of-type(1) {
  background: -webkit-linear-gradient(top, #e1dff5, #ececf8, #cacaec);
}
.model ul li:nth-of-type(2) {
  background: -webkit-linear-gradient(top, #ffedeb, #fce9e5, #f9dbd9);
}
/*推荐商品的样式*/
.recommend {
  padding: 10px 0;
  width: 90%;
  margin: 20px auto;
}
.recommend > .title {
  width: 100%;
  height: auto;
}
.recommend h3 {
  text-align: center;
  font: 16px/50px 微软雅黑;
  color: black;
}
.recommend .van.active h3 {
  font: bold 20px 微软雅黑;
  border-bottom: 3px solid red;
  padding-top: 12px;
  padding-bottom: 7px;
}
.recommend .van1 {
  font: bold 20px 微软雅黑;
  border-bottom: 3px solid red;
  padding-top: 12px;
  padding-bottom: 7px;
}
// .recommend h3::before {
//   content: "";
//   position: absolute;
//   top: 50%;
//   left: 0;
//   width: 40%;
//   height: 1px;
//   background: #ccc;
// }
// .recommend h3::after {
//   content: "";
//   position: absolute;
//   top: 50%;
//   right: 0;
//   width: 40%;
//   height: 1px;
//   background: #ccc;
// }
.recommend .listStyle {
  width: 100%;
  height: 40px;
  margin: 10px auto;
}
.recommend .listStyle li {
  padding-top: 2%;
  float: left;
  width: 23%;
  height: 90%;
  margin: 0 1%;
  text-align: center;
  background-color: rgb(241, 237, 237);
  border-radius: 20px;
  // position: relative;
}
.recommend .listStyle .active {
  color: #fc2d4b;
  background-color: #f9dbd9;
}
.recommend .list {
  display: flex;
  flex-wrap: wrap;
}
.recommend .recommend-item {
  width: 48%;
  background: #fff;
  margin-bottom: 6px;
  margin-left: 1%;
}
.recommend .imgs {
  position: relative;
  padding-top: 100%; /*将图像100%放进父级盒子中*/
  width: 100%;
}
.recommend img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.recommend .title {
  font-size: 15px;
  padding: 6px 0;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 2;
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.recommend .info {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
}
.recommend .price {
  color: #f00;
  font: 18px JDZhengHT-EN-Regular;
  font-weight: 700;
}
.recommend .count {
  font: bold 12px arial;
  color: grey;
}
</style>
