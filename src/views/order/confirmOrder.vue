<template>
  <!-- 订单结算和选择商品页面 -->
  <div class="order">
    <van-nav-bar title="订单结算" left-arrow @click-left="goBack" />
    <div class="address-warp">
      <div
        class="address addnull"
        v-if="!defaultAdd || !defaultAdd._id"
        @click="goAddress"
      >
        点击添加收获地址
      </div>
      <div class="address" v-else @click="editAddress">
        <div class="icon"><van-icon name="location" class="location" /></div>
        <div class="address-cont">
          <p class="name">
            收货人: {{ defaultAdd.name }}
            <span>{{ defaultAdd.tel }}</span>
          </p>
          <p class="address-e">收货地址: {{ defaultAdd.address }}</p>
          <p class="no">(收货不便时,可选择免费待收货服务)</p>
        </div>
        <div class="icon2"><van-icon name="arrow" class="location" /></div>
      </div>
      <img :src="caitiao" width="100%" height="3px" alt="" class="caitiao" />
      <Scroll class="scroll">
        <div class="goods-list">
          <div class="orders splitter">
            <div class="item" v-for="(item, key) in shopOrderList" :key="key">
              <img class="item-cover" :src="url + item.goods_img" alt />
              <div class="item-info">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-price">￥{{ item.market_price }}</div>
                <div class="item-counts">
                  <div>x{{ item.num }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="kd-info">
            <div>配送方式</div>
            <div>快递 <span class="my">免邮</span></div>
          </div>
          <div class="jf-info">
            <div>积分抵扣</div>
            <div class="jf">积分不足</div>
          </div>
          <div class="bz-info">
            <span>订单备注</span>
            <input type="text" placeholder="输入订单备注" class="bz" />
          </div>
        </div>
      </Scroll>
    </div>

    <div v-if="shopOrderList && shopOrderList.length">
      <van-submit-bar
        :loading="isLoading"
        :price="price"
        button-text="提交订单"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script>
import config from "@/assets/js/config";
import { vuexData } from "@/assets/js/mixin";
import Scroll from "@/components/Scroll";
import storage from "@/assets/js/storage";
// import { Field } from 'vant';
export default {
  name: "comfirmOrder",
  mixins: [vuexData],
  components: {
    Scroll,
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // this????
      vm.getDefaultAddress();
      if (!vm.shopOrderList.length) {
        vm.$router.push("/cart");
      }
    });
  },
  computed: {
    price() {
      let num = 0;
      if (this.shopOrderList.length) {
        this.shopOrderList.forEach((item) => {
          num += item.market_price * item.num;
        });
        return Number(num.toFixed(2) * 100);
      }
    },
  },

  data() {
    return {
      url: config.api,
      caitiao: require("@/assets/images/caitiao.jpg"),
      isLoading: false,
      list: [],
      defaultAdd: "",
    };
  },

  methods: {
    // 查询默认收货地址
    async getDefaultAddress() {
      try {
        const { data } = await this.Api.getDefaultAddress(this.userName._id);
        if (data.success) {
          this.defaultAdd = data.defaultAdd;
        }
      } catch (error) {
        this.$toast("网络错误");
      }
    },

    goBack() {
      this.$router.go(-1);
      setTimeout(() => {
        this.setShopList([]);
        this.setVuexAddress("");
      }, 300);
    },

    async onSubmit() {
      if (!this.defaultAdd) {
        this.$toast("请添加收获地址");
        return;
      }
      this.isLoading = true;
      // 传地址id，订单id，和总价格

      console.log(this.shopOrderList);
      //  001|5|红|l, 005|3|绿色|s,
      var itemStr = "";
      for (var i = 0; i < this.shopOrderList.length; i++) {
        var itemId = this.shopOrderList[i].id;
        var itemCounts = this.shopOrderList[i].num;
        var color = this.shopOrderList[i].color;
        var size = this.shopOrderList[i].size;
        var singleItem =
          itemId + "|" + itemCounts + "|" + color + "|" + size + ",";
        itemStr += singleItem;
      }

      try {
        const { data } = await this.Api.placeOrder({
          userId: this.userName._id,
          itemStr,
          address: this.defaultAdd._id,
          idDirect: this.shopOrderList[0].idDirect, //true 为立即购买
        });
        if (data.success) {
          this.isLoading = false;
          this.$toast("生成订单成功");
          let orderId = data.data.orderId;
          setTimeout(() => {
            this.setShopList([]);
            // 将已经生成订单的商品，从本地存储的addGoods中拿走。
            if (!storage.get("token")) {
              let addGoodsList = storage.get("addGoods") || [];
              for (var i = 0; i < this.shopOrderList.length; i++) {
                var itemId = this.shopOrderList[i]._id;
                for (var j = 0; j < addGoodsList.length; j++) {
                  if (itemId == addGoodsList[j].id) {
                    addGoodsList.splice(j, 1);
                  }
                }
              }
              storage.set("addGoods", addGoodsList);
            }
            this.$router.push({
              name: "payment",
              query: { orderId: orderId },
            });
          }, 2000);
        }
      } catch (err) {
        this.isLoading = false;
        this.$toast("网络错误");
      }
    },

    // 添加收货地址
    goAddress() {
      this.$router.push("/Address");
    },

    // 选择地址
    editAddress() {
      this.$router.push("/Address");
    },
  },
};
</script>

<style lang="css" scoped>
.order {
  position: fixed;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0px;
  z-index: 500;
  background: #fff;
}
.order .scroll {
  position: fixed;
  top: 148px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;
}
.order .address-warp .caitiao {
  margin-top: -6px;
}
.order .address-warp .addnull {
  align-items: center;
  padding: 0 !important;
  justify-content: center;
  font-size: 14px;
}
.order .address-warp .address {
  display: flex;
  height: 100px;
  padding: 10px;
  background: #fff;
}
.order .address-warp .address .icon {
  flex: 0 0 30px;
  width: 30px;
  align-self: center;
  margin-right: 8px;
}
.order .address-warp .address .icon .location {
  font-size: 24px;
}
.order .address-warp .address .address-cont {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.order .address-warp .address .address-cont .name {
  font-size: 16px;
  font-weight: 600;
  line-height: 16px;
}
.order .address-warp .address .address-cont .name span {
  float: right;
  margin-right: 10px;
}
.order .address-warp .address .address-cont .address-e {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
}
.order .address-warp .address .address-cont .no {
  color: #f9cc9d;
  font-size: 12px;
  letter-spacing: 1px;
  margin-top: -5px;
}
.order .address-warp .address .icon2 {
  flex: 0 0 10px;
  align-self: center;
}
.order .address-warp .goods-list {
  background: #fff;
}
.orders {
  margin-top: 5px;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.item {
  display: flex;
  flex-direction: row;
  padding: 8px 0;
  margin-bottom: 10px;
  border-bottom: 0.3px solid #eee;
}
.item-cover {
  width: 75px;
  height: 75px;
  margin-left: 5px;
  border-radius: 3px;
}
.item-info {
  position: relative;
  margin-left: 15px;
}
.item-title {
  font-size: 14px;
  font-weight: 600;
  width: 230px;
}
.item-price {
  position: absolute;
  bottom: 0;
}
.item-old-line {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.item-old-price {
  font-size: 12px;
  color: gray;
  text-decoration-line: line-through; /* 定义删除线 */
}
.item-counts {
  position: absolute;
  bottom: 0;
  left: 50px;
  color: gray;
}
.info {
  width: 100%;
}
.kd-info,
.jf-info,
.bz-info {
  width: 92%;
  font-size: 17px;
  margin: 0 12px 12px 12px;
  display: flex;
  justify-content: space-between;
}
.my {
  font-size: 18px;
  font-weight: 700;
}
.jf {
  color: gray;
}
.bz {
  width: 29.9%;
}
</style>
