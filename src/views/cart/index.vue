<template>
  <div :class="hasProduct ? 'page' : ''">
    <!--购物车navbar 导航-->
    <nav-bar class="wrap">
      <span slot="left" class="iconfont icon-fanhui" @click="gohome"></span>
      <div slot="center">购物车</div>
      <!-- <span slot="right" class="iconfont icon-saoyisao"></span> -->
      <van-icon slot="right" name="chat-o" dot size="20" class="right-i" />
    </nav-bar>
    <!--没商品的页面-->
    <div v-if="!hasProduct" class="no-cart">
      <img src="@/assets/images/no-cart.png" />
      <p>
        购物车还是空的哦
        <mt-button type="danger" size="large" @click="gohome">去逛逛</mt-button>
      </p>
    </div>
    <!--有商品的页面-->
    <div v-if="hasProduct" class="has-cart">
      <!--<i class="iconfont" :class="mycheck?'icon-yigouxuan':'icon-weigouxuan'"></i>-->
      <Scroll class="content">
        <div>
          <div>
            <van-swipe-cell
              v-for="(shop, key) in dataList"
              :key="key"
              class="goods"
            >
              <van-checkbox
                class="mycheckbox"
                checked-color="red"
                icon-size="18px"
                v-model="shop.checked"
                :value="shop"
                @change="handleChange(shop)"
              >
              </van-checkbox>
              <van-card
                :price="shop.market_price"
                :title="shop.title"
                class="goods-card"
                :thumb="url + shop.goods_img"
              />
              <div class="sku-info">
                <p>
                  颜色:{{ shop.color | getColor(colorResult) }} 大小:{{
                    shop.size | getSize(sizeResult)
                  }}
                </p>
              </div>
              <div class="productNum" @click="setcount(shop)">
                <AdditionAndSubtraction @count="count" :mycount="shop.num" />
              </div>
              <van-button
                slot="right"
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="del(shop, key)"
              />
            </van-swipe-cell>
          </div>
          <!-- 推荐商品 -->
          <div class="recommend">
            <div class="re-text">为你推荐</div>
            <ul class="list">
              <li
                class="recommend-item"
                v-for="(item, key) in dataArr"
                :key="key"
              >
                <router-link :to="'/productDetail/' + item._id">
                  <div class="imgs">
                    <img :src="url + item.goods_img" alt />
                  </div>
                  <div class="re-title">{{ item.title }}</div>
                  <div class="re-info">
                    <div class="all-price">
                      <span class="re-price">¥{{ item.market_price }}</span>
                      <span class="re-priced">¥{{ item.shop_price }}</span>
                    </div>
                    <span class="re-count"
                      ><van-icon name="star-o" /> {{ item.goods_number }}</span
                    >
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </Scroll>
      <!--结算-->
      <div class="calc">
        <div class="chooseAll">
          <van-checkbox
            class="chooseAll-i"
            checked-color="red"
            @click="handleAllChecked()"
            v-model="isAllChecked"
            icon-size="18px"
            >全选
          </van-checkbox>
        </div>
        <div class="price-i">
          <p class="price">
            <span>合计:</span>
            <span class="total">¥{{ computedSum }}</span>
          </p>
        </div>
        <div class="order-i">
          <p class="order" @click="placeOrder">去结算({{ sum }})</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SwipeCell } from "vant";
import { Dialog } from "vant";
import AdditionAndSubtraction from "@/components/AdditionAndSubtraction";
import { getaddGoodsByGoodsId, getCartIndexById } from "@/assets/js/util.js";
import storage from "@/assets/js/storage.js";
import navBar from "@/components/navbar.vue";
import config from "@/assets/js/config.js";
import { vuexData, page } from "@/assets/js/mixin";
import Scroll from "@/components/Scroll";
export default {
  name: "cart",
  filters: {
    getColor(x, colorResult) {
      // 获得颜色和尺寸数据

      for (var k in colorResult) {
        if (colorResult[k]._id == x) {
          return colorResult[k].color_name;
        }
      }
    },
    getSize(x, sizeResult) {
      // 获得颜色和尺寸数据

      for (var k in sizeResult) {
        if (sizeResult[k]._id == x) {
          return sizeResult[k].size_value;
        }
      }
    },
  },
  data() {
    return {
      colorResult: [],
      sizeResult: [],
      newCount: 1,
      url: config.api,
      hasProduct: false,
      checkgroup: [], // 勾选的商品，勾选商品才结算(重要)
      isAllChecked: false,
      sum: 0,
      dataList: [],
      addGoods: [],
      dataArr: [], // 本地存储的商品数据，num,id
    };
  },
  mixins: [vuexData, page],
  components: {
    navBar,
    AdditionAndSubtraction,
    Scroll,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // console.log(vm);
      if (from.name == "login") {
        vm.addShopDataList(); // 同步数据库
      }
      // 通过 `vm` 访问组件实例
    });
  },
  methods: {
    scrollToEnd() {
      if (this.dataArr.length >= 2) {
        if (this.hasMore()) {
          // ?算法在哪判断是否所有数据加载完了吗
          this.page++;
          this.recommend(true);
        } else {
          this.$toast({ message: "没有很多数据了~~", className: "zindex" });
        }
      }
    },
    async recommend(flag) {
      try {
        if (this.isLocked()) return; // 必须等待上一次请求完成
        this.locked(); //开始请求之前锁住

        let res = await this.Api.recommend(this.page);
        console.log(res);
        if (res.data.success) {
          this.setTotal(res.data.totals); // 总条数
          this.unLocked(); // 解锁
          if (flag) {
            this.setNewData(res.data.data); //分页累连的数据 concat
          } else {
            this.dataArr = res.data.data; // 第一次加载的数据
          }
        }
      } catch (error) {
        this.unLocked(); // 解锁
        this.$toast({ message: "网络错误", className: "zindex" });
      }
    },
    async delShop(shop) {
      await this.Api.deleteShop(
        this.userName._id,
        shop.id,
        shop.color,
        shop.size
      );
    },
    async getShop() {
      let res = await this.Api.getShop(this.userName._id);
      // 获得购物车的数据：
      if (res.data.success) {
        this.dataList = res.data.data;
        if (this.dataList != 0) {
          this.hasProduct = true;
          this.getProducts();
        } else {
          this.hasProduct = false;
        }
      }
    },
    // 提交订单
    placeOrder() {
      // 判断用户是否登录？
      if (this.computedSum <= 0) {
        this.$dialog.alert({
          message: "请至少选择一个产品去结算",
          className: "zindex",
        });
      } else if (!storage.get("token")) {
        this.$dialog
          .alert({
            message: "您尚未登录",
            className: "zindex",
          })
          .then(() => {
            this.$router.push("/login");
          });
      } else {
        let shopList = [];
        // 调转到确认订单
        this.$router.push("/confirmOrder");
        this.dataList.forEach((item) => {
          if (item.checked) {
            shopList.push(item);
          }
        });
        this.setShopList(shopList);
        // vuex 将购物车中购买的商品存入 shopOrderList
        // vuex 将来在其他页面中可以 获得到  this.shopOrderList
      }
    },
    async addShopDataList() {
      if (!this.addGoods) {
        return;
      }
      if (storage.get("token")) {
        // 登录后同步购物车
        for (let i = 0; i < this.addGoods.length; i++) {
          //  size,color,id
          this.Api.addShop(
            this.userName._id,
            this.addGoods[i].id, //商品id

            this.addGoods[i].num,
            this.addGoods[i].checked,
            this.addGoods[i].color,
            this.addGoods[i].size
          );
        }
        storage.remove("addGoods");
      }
    },
    gohome() {
      this.$router.push("/home");
    },
    async del(shop, key) {
      let index = getCartIndexById(this.addGoods, shop);
      // 删除本地存储中this.addGoods(删除对应商品)
      if (!storage.get("token")) {
        // 查找商品id在本地存储的下标
        this.$dialog
          .alert({
            message: "删除成功",
            className: "zindex",
          })
          .then(() => {
            window.location.reload();
            this.dataList.splice(key, 1);
            this.addGoods.splice(index, 1);
            storage.set("addGoods", this.addGoods);
          });
      } else {
        this.$dialog
          .alert({
            message: "删除成功",
            className: "zindex",
          })
          .then(() => {
            window.location.reload();
            this.dataList.splice(key, 1);
            this.delShop(shop);
          });
      }
    },
    async handleAllChecked() {
      console.log("处理多选按钮", this.isAllChecked);

      if (this.isAllChecked) {
        console.log(this.dataList);
        if (!storage.get("token")) {
          for (let i = 0; i < this.addGoods.length; i++) {
            this.addGoods[i].checked = true;
            storage.set("addGoods", this.addGoods);
          }
        }

        for (let i = 0; i < this.dataList.length; i++) {
          this.dataList[i].checked = true;
          let shop = this.dataList[i];
          if (storage.get("token")) {
            await this.Api.editCart(
              this.userName._id,
              shop.num,
              shop.id,
              shop.checked,
              shop.color,
              shop.size
            );
            this.getShopNum(); //重新渲染徽标数量
          }
        }
      } else {
        if (!storage.get("token")) {
          for (let i = 0; i < this.addGoods.length; i++) {
            this.addGoods[i].checked = false;
            storage.set("addGoods", this.addGoods);
          }
        }
        for (let i = 0; i < this.dataList.length; i++) {
          this.dataList[i].checked = false;
          let shop = this.dataList[i];
          if (storage.get("token")) {
            await this.Api.editCart(
              this.userName._id,
              shop.num,
              shop.id,
              shop.checked,
              shop.color,
              shop.size
            );
            this.getShopNum(); //重新渲染徽标数量
          }
        }
      }
    },
    async handleChange(shop) {
      console.log(shop);
      // 查找商品id在本地存储的下标
      if (!storage.get("token")) {
        let index = getCartIndexById(this.addGoods, shop);
        if (shop.checked == true) {
          this.addGoods[index].checked = true;
        } else {
          this.addGoods[index].checked = false;
        }
        storage.set("addGoods", this.addGoods);
      } else {
        await this.Api.editCart(
          this.userName._id,
          shop.num,
          shop.id,
          shop.checked,
          shop.color,
          shop.size
        );
      }
      let checkedCount = 0;
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].checked == true) {
          checkedCount++;
        }
      }
      if (this.dataList.length == checkedCount) {
        this.isAllChecked = true;
      } else {
        this.isAllChecked = false;
      }
      this.sum = checkedCount;
    },

    count(num) {
      this.newCount = num;
    },
    async setcount(shop) {
      //  购物车的本地存储数量和 远程数据库的数量的更新
      shop.num = this.newCount;
      console.log(shop.num);
      if (!storage.get("token")) {
        // 查找商品id在本地存储的下标
        let index = getCartIndexById(this.addGoods, shop);
        this.addGoods[index].num = shop.num;
        storage.set("addGoods", this.addGoods);
      } else {
        await this.Api.editCart(
          this.userName._id,
          shop.num,
          shop.id,
          shop.checked,
          shop.color,
          shop.size
        );
        this.getShopNum(); //重新渲染徽标数量
      }
    },
    async getProducts() {
      if (!storage.get("token")) {
        // 未登录的购物车：
        let ids = "";
        for (var k in this.addGoods) {
          ids += this.addGoods[k].id + ",";
        }
        console.log(ids);
        let res = await this.Api.getProducts(ids);

        let datas = res.data.data;
        for (let i = 0; i < datas.length; i++) {
          let dataone = datas[i]; // 每个商品
          // 通过 同一个商品的 _id  找对应的 addGoods商品的下标(多个)
          //  indexs = [0,1];
          var indexs = getaddGoodsByGoodsId(this.addGoods, dataone._id);
          console.log(indexs);
          for (var key in indexs) {
            this.$set(
              this.addGoods[indexs[key]],
              "goods_img",
              dataone.goods_img
            );
            this.$set(this.addGoods[indexs[key]], "title", dataone.title);
            this.$set(
              this.addGoods[indexs[key]],
              "market_price",
              dataone.market_price
            );
            this.dataList.push(this.addGoods[indexs[key]]);
          }
        }
      }
      // 重要，循环遍历 this.dataList check 如果是true this.checkgroup添加对应数据复选框就勾选了
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].checked == true) {
          this.checkgroup.push(this.dataList[i]);
          this.sum++;
        }
      }
      if (this.checkgroup.length === this.dataList.length) {
        console.log("全选中");
        this.isAllChecked = true;
      } else {
        console.log("没全选");
        this.isAllChecked = false;
      }
    },
  },
  computed: {
    computedSum() {
      // console.log("重新计算总金额，关注已经勾选的数据，累加计算就可以了");
      var mysum = 0;
      for (var i = 0; i < this.dataList.length; i++) {
        //一个商品= 单价*数量
        if (this.dataList[i].checked == true) {
          mysum += this.dataList[i].num * this.dataList[i].market_price;
          console.log(this.dataList[i].num, this.dataList[i].market_price);
        }
      }
      return mysum;
    },
  },
  async mounted() {
    // 获得本地存储的 addGoods 如果有商品 将 this.hasProduct = true
    this.addGoods = storage.get("addGoods") || [];
    if (!storage.get("token")) {
      if (this.addGoods.length != 0) {
        this.hasProduct = true;
        this.getProducts();
      } else {
        this.hasProduct = false;
      }
    } else {
      setTimeout(() => {
        this.getShop();
      }, 400);
    }
    let resInfo = await this.Api.getColorSize();
    // 获得颜色和尺寸：
    if (resInfo.data.success) {
      this.colorResult = resInfo.data.colorResult;
      this.sizeResult = resInfo.data.sizeResult;
    }
    this.recommend(false);
    this.ChangTabbarShow(false);
  },
  destroyed() {
    this.ChangTabbarShow(true);
  },
};
</script>

<style lang="scss" scoped>
.page {
  background-color: #eee;
}
.van-card {
  padding: 8px 40px;
}
.goods {
  margin-bottom: 8px;
}
.goods-card {
  margin: 0;
  font-size: 15px;
  background-color: #fff;
}
.sku-info {
  position: absolute;
  top: 43%;
  right: 40%;
  font-size: 12px;
}
.delete-button {
  height: 100%;
}
.content {
  height: 550px;
}
.wrap {
  margin-bottom: 8px;
  background-color: #fff;
}
.right-i {
  position: absolute;
  right: 23px;
  bottom: 18px;
}
/*没商品的样式*/
.no-cart {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 50px 0 10px;
}
.no-cart img {
  width: 50%;
  height: 50%;
}
.no-cart p {
  padding: 30px 0;
  font: 20px 微软雅黑;
}

.mycheckbox {
  position: absolute;
  left: 10px;
  top: 38%;
  z-index: 200;
}
.info {
  width: 40%;
  padding: 0 8px;
  font: 12px/20px 微软雅黑;
}
.info .price {
  color: #f00;
}
.productNum {
  position: absolute;
  bottom: 10%;
  right: 0;
  width: 30%;
  display: flex;
  align-items: center;
}
/*底部 结算*/
.calc {
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  z-index: 9999 !important;
  line-height: 50px;
  padding: 0 0 0 10px;
  border-top: 1px solid #eee;
}
.chooseAll {
  width: 20%;
  position: relative;
}
.chooseAll-i {
  position: absolute;
  bottom: 14px;
}
.price-i {
  position: relative;
  width: 50%;
}
.price {
  position: absolute;
  right: 20px;
  color: #f00;
}
.order-i {
  position: relative;
  width: 30%;
}
.order {
  position: absolute;
  height: 30px;
  line-height: 30px;
  width: 90%;
  background: #f00;
  text-align: center;
  color: #fff;
  border-radius: 20px;
  right: 10px;
  bottom: 9px;
}
// 推荐商品
.recommend {
  padding: 10px 10px;
  background-color: #fff;
}
.recommend .re-text {
  position: relative;
  text-align: center;
  font: bold 16px/40px 微软雅黑;
  color: red;
}
.recommend .re-text::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 28%;
  width: 10%;
  height: 1px;
  background: red;
}
.recommend .re-text::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 28%;
  width: 10%;
  height: 1px;
  background: red;
}
.recommend .list {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
}
.recommend .recommend-item {
  width: 48%;
  background: #fff;
  margin: 5px auto;
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
.recommend .re-title {
  font-size: 14px;
  padding: 6px;
  line-height: 26px;
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
.recommend .re-info {
  width: 100%;
  height: 25px;
  padding: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.recommend .re-price {
  color: #f00;
  font: 16px JDZhengHT-EN-Regular;
}
.recommend .re-priced {
  color: #888;
  font: 14px JDZhengHT-EN-Regular;
  margin-left: 4px;
  text-decoration: line-through;
}
.recommend .re-count {
  font: bold 12px arial;
  color: #888;
  margin-top: 2px;
}
</style>
