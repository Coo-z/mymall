<template>
  <div class="result">
    <div class="filters">
      <!-- // orderBy: is_new 最新商品,click_count, shop_price   -->
      <div
        class="item"
        :class="orderBy == '' ? 'active' : ''"
        @click="filter('')"
      >
        综合
      </div>
      <div
        class="item"
        :class="orderBy == 'is_new' ? 'active' : ''"
        @click="filter('is_new')"
      >
        新品
      </div>
      <div
        class="item"
        :class="orderBy == 'click_count' ? 'active' : ''"
        @click="filter('click_count')"
      >
        销量
      </div>
      <div
        class="item"
        :class="orderBy == 'shop_price' ? 'active' : ''"
        @click="filter('shop_price')"
      >
        价格
      </div>
    </div>
    <Scroll class="content">
      <div>
        <div v-if="listType == 1">
          <div v-for="(item, index) in results" :key="index">
            <router-link :to="'/productDetail/' + item._id" class="list1">
              <img :src="url + item.goods_img" width="80" class="img" />
              <div class="goods-info">
                <div class="title ellipsis">{{ item.title }}</div>
                <div class="price">¥ {{ item.shop_price }}</div>
                <div class="buy-info">
                  <div class="num">已售出{{ item.click_count }}件</div>
                  <img class="car" src="@/assets/icon/car.svg" />
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div v-if="listType == 2" class="list2-box">
          <div class="list2" v-for="(item, index) in results" :key="index">
            <router-link :to="'/productDetail/' + item._id">
              <img :src="url + item.goods_img" width="80" class="img" />
              <div class="goods-info">
                <div class="title">{{ item.title }}</div>
                <div class="price">¥ {{ item.shop_price }}</div>
                <div class="buy-info">
                  <div class="num">已购{{ item.click_count }}件</div>
                  <img class="car" src="@/assets/icon/car.svg" />
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div class="no-result" v-show="!results.length">没有结果</div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from "@/components/Scroll";
import config from "@/assets/js/config";
export default {
  name: "SearchResult",
  components: {
    Scroll,
  },
  data() {
    return {
      results: [],
      url: config.api,
      orderBy: "",
    };
  },
  props: {
    query: {
      type: String,
      default: "",
    },
    listType: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    query(query) {
      this.getResults(query, "");
    },
  },
  methods: {
    async getResults(keyword, orderBy) {
      if (!keyword) {
        return;
      }
      console.log(orderBy);
      let res = await this.Api.search(keyword, orderBy);
      this.results = res.data.data;
    },
    async filter(orderBy) {
      // orderBy: is_new 最新商品,click_count 销量, shop_price 价格
      this.orderBy = orderBy;
      await this.getResults(this.query, this.orderBy);
    },
  },
  mounted() {
    this.filter("");
  },
};
</script>
<style lang="css" scoped>
.content {
  height: 500px;
  overflow: hidden;
}
.line {
  width: 100vw;
  height: 1px;
  background: #dfdfdf;
}
.filters {
  width: 100vw;
  height: 44px;
  line-height: 44px;
  background: #fff;
  display: flex;
  justify-content: space-around;
  margin-bottom: 5px;
}
.filters .item {
  line-height: 44px;
}
.filters .active {
  color: #fa1e26;
}
.list1 {
  margin: 8px;
  width: 100%;
  height: 110px;
  display: flex;
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}
.list1 .img {
  width: 110px;
  height: 110px;
  flex-shrink: 0;
}
.list1 .goods-info {
  padding: 8px 16px 0 12px;
  width: 100%;
}
.list1 .goods-info .title {
  color: #333;
  font-size: 15px;
}
.ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.list1 .goods-info .price {
  color: #ff3b30;
  font-size: 17px;
}
.list1 .goods-info .buy-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list1 .goods-info .buy-info .num {
  font-size: 12px;
  color: #999999;
}
.list1 .goods-info .buy-info .car {
  position: absolute;
  right: 20px;
  bottom: 8px;
  width: 25px;
  height: 25px;
}
.list2-box {
  margin: 8px;
  width: 359px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.list2 {
  margin: 8px 0;
  width: 175px;
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}
.list2 .img {
  width: 175px;
  height: 175px;
}
.list2 .goods-info {
  padding: 8px;
}
.list2 .goods-info .title {
  color: #333;
  font-size: 15px;
}
.list2 .goods-info .price {
  color: #ff3b30;
  font-size: 17px;
}
.list2 .goods-info .buy-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list2 .goods-info .buy-info .num {
  font-size: 12px;
  color: #999999;
}
.list2 .goods-info .buy-info .car {
  width: 25px;
  height: 25px;
  position: absolute;
  right: 8px;
  bottom: 8px;
}
</style>
