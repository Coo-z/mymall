<template>
  <div>
    <van-nav-bar title="订单结算" left-arrow @click-left="goback" />
    <div class="list-warp" v-if="orderResult">
      <div class="top border-bottom">
        <div>订单编号: {{ orderResult.order_id }}</div>
      </div>
      <div class="list" v-for="val in orderItemResult" :key="val._id">
        <img class="good-img" :src="url + val.product_img" />
        <div class="good-title">{{ val.product_title }}</div>
        <div class="good-count">
          <p>￥{{ val.product_price }}</p>
          <p class="count">x{{ val.product_num }}</p>
        </div>
      </div>
      <div class="timre bottom border-top">
        创建时间: {{ orderResult.add_time }}
      </div>
      <div class="bottom">收货地址: {{ orderResult.address }}</div>
      <div class="bottom">
        共 {{ orderItemResult.length }} 件商品 合计:
        {{ orderResult.mallPrice }}
      </div>
    </div>

    <div class="section section-payment">
      <div class="cash-title">选择以下支付方式付款</div>
      <div class="payment-box">
        <div class="payment-body">
          <ul class="payment-list">
            <li class="J_bank" id="alipay">
              <a target="_blank" @click="payment">
                <img
                  src="@/assets/images/payOnline_zfb.png"
                  alt="支付宝"
                  style="margin-left: 0"
                />
              </a>
            </li>
            <li id="weixinPay">
              <img
                src="@/assets/images/weixinpay0701.png"
                alt="微信支付"
                style="margin-left: 0"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import config from "@/assets/js/config";
import { vuexData } from "@/assets/js/mixin";
import Scroll from "@/components/Scroll";
import storage from "@/assets/js/storage";
export default {
  name: "payment",
  mixins: [vuexData],
  components: {
    Scroll,
  },
  data() {
    return {
      orders: [],
      orderResult: null,
      orderItemResult: null,
      url: config.api,
    };
  },
  mounted() {
    if (!storage.get("token")) {
      this.orderList = [];
    } else {
      this.getConfirmInfo();
    }
  },
  methods: {
    async getConfirmInfo() {
      const { data } = await this.Api.confirm(this.$route.query.orderId);
      console.log(data.data);
      if (data.success) {
        this.orderResult = data.data.orderResult;
        this.orderItemResult = data.data.orderItemResult;
      }
    },
    async payment() {
      if (!storage.get("token")) {
        this.orderList = [];
      } else {
        const { data } = await this.Api.alipaypay(this.$route.query.orderId);
        console.log(data);
        if (data.success) {
          //console.log(data.data);
          // 为模拟支付测试增加的接口,将来去掉
          await this.Api.changeOrderInfo(this.$route.query.orderId);
          setTimeout(() => {
            location.href = data.data; // 拿到拉取支付的地址并且打开支付界面
          }, 1000);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list-warp {
  margin: 10px;
  box-sizing: border-box;
  padding: 15px 10px;
  background: #fff;
  border-radius: 10px;
}
.list-warp .top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}
.list-warp .top .order-ok {
  color: #d2591b;
}
.list-warp .list {
  display: flex;
  height: 80px;
  margin-top: 15px;
  font-size: 0;
}
.list-warp .list .good-img {
  flex: 0 0 80px;
  width: 80px;
  height: 100%;
  border-radius: 10px;
  margin-right: 10px;
  border: 1px solid #eee;
}
.list-warp .list .good-title {
  flex: 1;
  margin-top: 3px;
  line-height: 1.4;
  font-size: 13px;
  letter-spacing: 0.5px;
  margin-right: 10px;
}
.list-warp .list .good-count {
  float: 0 0 15%;
  text-align: right;
  margin-top: 5px;
  font-size: 13px;
}
.list-warp .list .good-count .count {
  margin-top: 5px;
  color: #bbb;
}
.list-warp .bottom {
  text-align: right;
  margin-top: 10px;
}
.list-warp .timre {
  margin-top: 10px;
  padding-top: 10px;
}
.navbar {
  background: linear-gradient(#eee, #ddd) !important; /*渐变*/
}
.section-payment {
  display: flex;
  height: 300px;
  flex-direction: column;
  background-color: #f2f5f8;
}
.cash-title {
  font: bold 16px 微软雅黑;
  padding: 30px 0 30px 10px;
}
.payment-list {
  display: flex;
  justify-content: space-around;
}
.payment-list li {
  width: 46%;
}
</style>