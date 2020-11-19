<template>
  <div class="page-tab my">
    <van-nav-bar title="我的主页" :left-arrow="false" />
    <div class="avatar" v-if="!userName">
      <img
        src="http://img4.imgtn.bdimg.com/it/u=198369807,133263955&fm=27&gp=0.jpg"
        alt
        srcset
      />
      <p @click="login">登录/注册</p>
    </div>
    <div class="avatar" v-else>
      <img :src="url + userName.avatar" :onerror="defaultImg" />
      <p class="usename">
        欢迎您：{{ userName.nickname || userName.username }}
      </p>
      <p @click="loginOut">退出登录</p>
      <van-icon name="setting" class="setting" @click="settingUser" />
    </div>
    <div class="user-links van-row">
      <div
        class="van-col van-col--6 numlist"
        v-for="(val, index) in tabs"
        :key="val.status"
        @click="status(val.status)"
      >
        <van-icon :name="val.icon" />
        <span>{{ val.title }}</span>
        <span class="num" v-if="orderNum && orderNum[index] != 0">{{
          orderNum[index]
        }}</span>
      </div>
    </div>
    <van-cell-group class="user-group">
      <van-cell icon="records" title="全部订单" is-link @click="myOrder" />
    </van-cell-group>

    <van-cell-group>
      <van-cell icon="star-o" title="我的收藏" is-link @click="fav" />
      <van-cell icon="location-o" @click="address" title="地址管理" is-link />
    </van-cell-group>
    <UserInfo ref="userInfo" />
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<script>
import UserInfo from "./UserInfo";
import { vuexData } from "@/assets/js/mixin";
import storage from "@/assets/js/storage";
import config from "@/assets/js/config";
export default {
  name: "My",
  mixins: [vuexData],

  components: {
    UserInfo,
  },
  data() {
    return {
      url: config.api,
      show: false,
      defaultImg: "",
      orderNum: "", //订单数量，
      // 0,待付款 1，待发货 2，待收货 3，评价 4，已完成
      tabs: [
        { status: 1, icon: "balance-pay", title: "待付款" },
        { status: 2, icon: "free-postage", title: "待发货" },
        { status: 3, icon: "points", title: "待收货" },
        { status: 4, icon: "thumb-circle-o", title: "评价" },
        { status: 5, icon: "like-o", title: "已完成" },
      ],
    };
  },

  methods: {
    settingUser() {
      this.$refs.userInfo.showPop();
    },

    login() {
      this.$router.push("/login");
    },

    address() {
      if (this.userName) {
        this.$router.push({ name: "Address" });
      } else {
        this.$router.push({ name: "Login" });
      }
    },

    fav() {
      this.$router.push("/fav");
    },

    // 退出登录
    async loginOut() {
      try {
        const { data } = await this.Api.loginOut();
        if (data.code == 0) {
          this.removeToken();
          this.removeName();
          window.location.reload();
        }
      } catch (error) {
        this.$toast("网络错误");
      }
    },

    myOrder() {
      this.$router.push({ name: "MyOrder" });
    },

    status(i) {
      if (i == 4) {
        this.$router.push("/comment");
      } else {
        if (i == 5) {
          i = 4;
        }
        this.$router.push({ name: "MyOrder", query: { status: i } }); // 1,2,3,4
      }
    },
  },

  async created() {
    if (storage.get("token")) {
      try {
        const { data } = await this.Api.getOrderNum(this.userName._id);
        if (data.code == 200) {
          this.orderNum = data.numList;
        }
      } catch (error) {
        this.$toast("网络错误");
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.my {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.avatar {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  background: #e33d0c;
  padding: 10% 0 10% 0;
  box-sizing: border-box;
  position: relative;
  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
  p {
    color: #fff;
    font-size: 14px;
    margin-top: 20px;
  }
}
.user {
  &-poster {
    width: 100%;
    height: 100%;
    display: block;
  }
  &-group {
    margin-bottom: 0.3rem;
  }
  &-links {
    padding: 15px 0;
    font-size: 14px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 24px;
      margin-bottom: 10px;
    }
  }
}
.van-cell {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  padding: 10px 15px;
  box-sizing: border-box;
  position: relative;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  overflow: hidden;
  align-items: center;
  .van-cell__left-icon {
    font-size: 16px;
    line-height: 24px;
    margin-right: 5px;
  }
  .van-cell__right-icon {
    color: #999;
    font-size: 12px;
    line-height: 35px;
    margin-left: 5px;
  }
}
.usename {
  font-weight: 700;
  font-size: 18px !important;
}
.setting {
  color: #eee;
  font-size: 20px;
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 10px;
}

.numlist {
  position: relative;
  width: 20%;
}
.numlist .num {
  position: absolute;
  right: 15px;
  top: -8px;
  color: #fff;
  background: #e0322b;
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  border-radius: 50%;
}
</style>