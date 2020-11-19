<template>
  <div class="body">
    <div class="nav">
      <div class="nav-left" @click="goback">
        <van-icon name="arrow-left" class="nav-back" />
      </div>
      <div class="nav-center">
        <van-search
          v-model="value"
          shape="round"
          background="#fff"
          placeholder="想找的搜出来"
          @click="goToSearch"
        />
      </div>
      <div class="nav-right">
        <router-link to="" class="nav-info">
          <van-icon name="envelop-o" class="nav-right-icon" />
        </router-link>
        <router-link to="/cart" class="nav-cart">
          <van-icon name="shopping-cart-o" class="nav-right-icon" />
        </router-link>
      </div>
    </div>
    <!-- Tab切换 -->
    <div class="tab">
      <div ref="menuWrapper" class="titles menu-wrapper">
        <div>
          <ul class="title">
            <li
              v-for="(item, key) in titles"
              :key="key"
              :class="{ active: curId == key }"
              @click="switchTab(key)"
            >
              {{ item.title }}
            </li>
          </ul>
        </div>
      </div>
      <div class="contents foods-wrapper" ref="foodsWrapper">
        <div class="first">
          <ul
            class="list good-List-hook"
            v-for="(cateInfo, key) in productByCat"
            :key="key"
          >
            <li
              class="recommend-item"
              v-for="(item, key) in cateInfo.goodsList"
              :key="key"
            >
              <router-link :to="'/productDetail/' + item._id">
                <div class="imgs">
                  <img :src="url + item.goods_img" alt />
                </div>
                <p class="title">{{ item.title }}</p>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/assets/js/config.js";
import navBar from "@/components/navbar.vue";
import { vuexData } from "@/assets/js/mixin.js";
import BScroll from "better-scroll";
export default {
  name: "category",
  mixins: [vuexData],
  components: {
    navBar,
  },
  data() {
    return {
      value: "",
      listHeight: [],
      scrollY: 0,
      titles: [],
      productByCat: [],
      url: config.api,
      key: 0,
    };
  },
  methods: {
    goToSearch() {
      this.$router.push("/search");
    },
    goback() {
      this.$router.go(-1);
    },
    async getTitles() {
      var res = await this.Api.getCate();
      if (res.data.success) {
        this.titles = res.data.data;
      }
      console.log(res.data.data);
    },
    async getContent() {
      let res = await this.Api.catesAndGoods();
      if (res.data.success) {
        this.productByCat = res.data.data;
      }
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
        this.scrollY = Math.abs(Math.round(pos.y)) + 55.5;
      });
    },
    calculateHeight() {
      let goodsList = this.$refs.foodsWrapper.getElementsByClassName(
        "good-List-hook"
      );
      let height = 55.5;
      this.listHeight.push(height);
      for (let i = 0; i < goodsList.length; i++) {
        let item = goodsList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
      console.log(this.listHeight);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    switchTab(index) {
      // 更改动态 curId
      let goodsList = this.$refs.foodsWrapper.getElementsByClassName(
        "good-List-hook"
      );
      let el = goodsList[index]; // 重要重要,通过索引找对应的楼层(版块)
      this.foodsScroll.scrollToElement(el, el.clientHeight); // 重要，通过scrollToElement，跳到指定版块
      console.log(el.clientHeight);
    },
  },
  mounted() {
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
};
</script>

<style lang="scss" scoped>
.body {
  height: 100%;
}
ul,
li {
  padding: 0;
  margin: 0;
}
.nav {
  height: 55px;
  width: 100%;
  border-bottom: 0.5px solid #eee;
}
.nav-back {
  position: absolute;
  left: 35%;
  top: 35%;
}
.nav-left {
  position: relative;
  width: 10%;
  height: 100%;
  float: left;
}
.nav-center {
  width: 73%;
  height: 100%;
  float: left;
}
.nav-right {
  height: 100%;
  width: 17%;
  float: left;
}
.nav-info,
.nav-cart {
  display: block;
  width: 50%;
  height: 100%;
  float: left;
  position: relative;
}
.nav-right-icon {
  position: absolute;
  left: 18%;
  top: 35%;
}
.tab {
  display: flex;
  height: 100%;
}
.tab > .titles {
  background-color: rgb(247, 247, 247);
  margin-right: 8px;
  box-sizing: border-box;
  // height: 600px;
}
.title {
  width: 80px;
}
.title li {
  text-align: center;
  font: 500 14px 新宋体;
  line-height: 30px;
}
.title li.active {
  color: red;
  border-right: 0;
  background-color: #fff;
  position: relative;
}
.title li.active:after {
  content: "";
  height: 40%;
  width: 2px;
  position: absolute;
  left: 0;
  top: 30%;
  background-color: red;
}
.contents {
  flex: 1;
  padding: 8px 8px 0 0;
  overflow: hidden;
  height: 600px;
}
/*tab对应的内容*/
.contents .list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  border-bottom: 1.5px solid rgb(247, 247, 247);
  border: 1px solid #eee;
  border-radius: 5px;
  margin-bottom: 10px;
  // box-shadow: 3px 3px rgb(245, 245, 245);
  box-shadow: 0px -2px rgb(245, 245, 245), -3px 0px rgb(245, 245, 245),
    2px 0px rgb(245, 245, 245), 0px 2px rgb(245, 245, 245);
}
.contents .recommend-item {
  width: 46%;
  height: 175px;
  background: #fff;
  margin: 10px auto;
  overflow: hidden;
}
.contents .imgs {
  position: relative;
  padding-top: 100%; /*将图像100%放进父级盒子中*/
  margin: auto;
  width: 100%;
}
.contents img {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3px;
}
.contents .title {
  width: 100%;
  font-size: 14px;
  padding: 8px 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 2;
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
