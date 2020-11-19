<template>
  <!--实时热销navbar 导航-->
  <div class="body">
    <nav-bar class="nav">
      <div slot="left">
        <i class="iconfont icon-fanhui" @click="goback()"></i>
      </div>
      <div slot="center">实时热销</div>
    </nav-bar>
    <div>
      <div class="content">
        <img src="@/assets/images/hotsale.jpg" alt="" />
      </div>
      <!-- Tab切换 -->
      <div class="tab">
        <div ref="menuWrapper" class="titles menu-wrapper">
          <van-swipe
            :loop="false"
            :width="90"
            class="title"
            :show-indicators="false"
          >
            <van-swipe-item
              class="list"
              v-for="(item, key) in titles"
              :key="key"
              :class="{ active: curId == key }"
              @click="switchTab(key)"
              >{{ item.title }}
            </van-swipe-item>
          </van-swipe>
        </div>
        <Scroll class="contentS" :pullup="false">
          <div class="contents foods-wrapper" ref="foodsWrapper">
            <div class="first">
              <ul
                class="list good-List-hook"
                v-for="(cateInfo, key) in productByCat"
                :key="key"
              >
                <div class="con-title">
                  <div class="p1">{{ cateInfo.title }}热销版</div>
                </div>
                <li
                  class="recommend-item"
                  v-for="(item, key) in cateInfo.goodsList"
                  :key="key"
                >
                  <router-link :to="'/productDetail/' + item._id">
                    <div>
                      <div class="imgs">
                        <img :src="url + item.goods_img" alt />
                      </div>
                      <p class="name">{{ item.title }}</p>
                      <p class="price">￥{{ item.market_price }}.00</p>
                      <button>立即购买</button>
                    </div>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </Scroll>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "@/components/navbar.vue";
import Scroll from "@/components/Scroll";
import { vuexData } from "@/assets/js/mixin";
import config from "@/assets/js/config.js";
import BScroll from "better-scroll";
export default {
  name: "hot-sale",
  mixins: [vuexData],
  components: {
    navBar,
    Scroll,
  },
  data() {
    return {
      hotgoods: [],
      url: config.api,
      value: "",
      listHeight: [],
      scrollY: 0,
      titles: [],
      productByCat: [],
    };
  },
  methods: {
    async getTitles() {
      var res = await this.Api.getCate();
      if (res.data.success) {
        this.titles = res.data.data;
      }
    },
    async getContent() {
      let res = await this.Api.catesAndGoodsHot();
      if (res.data.success) {
        this.productByCat = res.data.data;
      }
      console.log(this.productByCat);
    },
    initScroller() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true,
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3,
        click: true,
      });
      this.foodsScroll.on("scroll", (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y)) + 56;
        // console.log(this.scrollY); // 重要重要重要，右内容的滚动条记录滚动的垂直坐标值
      });
    },
    calculateHeight() {
      let goodsList = this.$refs.foodsWrapper.getElementsByClassName(
        "good-List-hook"
      );
      let height = 56;
      this.listHeight.push(height);
      for (let i = 0; i < goodsList.length; i++) {
        let item = goodsList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
      // console.log(this.listHeight);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    switchTab(index) {
      // 更改动态 curId
      let goodsList = this.$refs.foodsWrapper.getElementsByClassName(
        "good-List-hook"
      );
      console.log(goodsList); // 每个版块
      let el = goodsList[index]; // 重要重要,通过索引找对应的楼层(版块)
      this.foodsScroll.scrollToElement(el, el.clientHeight); // 重要，通过scrollToElement，跳到指定版块
    },
  },
  mounted() {
    this.ChangTabbarShow(false);
    // this.else(false);
    this.getTitles(); // 获得标题的接口方法
    this.getContent(); // 获得分类下所有商品的接口方法
    setTimeout(() => {
      this.initScroller();
      this.calculateHeight();
    }, 1000);
  },
  computed: {
    curId() {
      // 监听动态索引curId
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          // 判断范围
          return i;
        }
      }
      return 0;
    },
  },
  destroyed() {
    this.ChangTabbarShow(true);
  },
};
</script>

<style lang="scss" scoped>
.nav {
  background-color: white;
  color: black;
  font-size: 20px;
}
.contentS {
  height: 600px;
  background-color: white;
  overflow: hidden;
}
.title {
  width: 100%;
  height: 42px;
  border-bottom: 1px solid lightgrey;
  border-top: 1px solid lightgrey;
  background-color: white;
  padding: 10px 0;
}
.top {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.title .list {
  height: 100%;
  text-align: center;
  padding-bottom: 5px;
}
.title .list.active {
  height: 30px;
  color: red;
  border-bottom: 2px solid red;
}
.contents {
  flex: 1;
  margin-top: 8px;
  overflow: hidden;
  height: 600px;
}
/*tab对应的内容*/
.contents .list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  border-bottom: 1px solid rgb(247, 247, 247);
}
.contents .recommend-item {
  width: 46%;
  height: auto;
  background: #fff;
  margin: 6px 2% 6px 2%;
  box-shadow: 0px -1px 2px 2px #dbd9d9;
}
.contents .imgs {
  position: relative;
  padding-top: 100%; /*将图像100%放进父级盒子中*/
  margin: auto;
  width: 100%;
  height: auto;
}
.contents img {
  position: absolute;
  top: 0;
  left: 0;
}
.contents .title {
  font-size: 12px;
  padding: 6px 0;
  line-height: 22px;
  /* text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap; */
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 2;
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.list .con-title {
  width: 94%;
  height: auto;
  margin: 35px 3% 15px 3%;
  border-radius: 10px;
  padding: 10px 20px;
  background: -webkit-linear-gradient(right, #feb19d, #fd8c6c);
}
.list .con-title .p1 {
  font-size: 20px;
  font-weight: 500;
  color: white;
  margin-bottom: 10px;
}
.recommend-item .name {
  width: 90%;
  margin: 10px auto;
  text-overflow: ellipsis;
  overflow: hidden;
  line-clamp: 1;
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 20px;
}
.recommend-item .price {
  width: 90%;
  height: auto;
  margin-left: 5%;
  margin-bottom: 5px;
  color: red;
}
.recommend-item button {
  width: 90%;
  height: auto;
  margin-left: 5%;
  margin-bottom: 10px;
  border: 1px solid red;
  border-radius: 20px;
  background-color: white;
}
</style>
