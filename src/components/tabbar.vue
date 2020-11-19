<template>
  <div class="list">
    <router-link to="/home" class="link">
      <i class="iconfont icon-shouye"></i>
      <span>首页</span>
    </router-link>

    <router-link to="/category" class="link">
      <i class="iconfont icon-fenlei"></i>
      <span>分类</span>
    </router-link>

    <router-link to="/cart" class="link">
      <i class="iconfont icon-icon-test">
        <mt-badge
          style="
            position: absolute;
            top: 0;
            right: 15px;
            width: 18px;
            height: 18px;
            line-height: 18px;
            padding: 0;
          "
          color="#f00"
          v-if="flag"
          >{{ shopnum }}</mt-badge
        >
      </i>
      <span>购物车</span>
    </router-link>

    <router-link to="/my" class="link">
      <i class="iconfont icon-icon-test3"></i>
      <span>我的</span>
    </router-link>
  </div>
</template>

<script>
import storage from "@/assets/js/storage.js";
import { vuexData } from "@/assets/js/mixin";
export default {
  name: "tabbar",
  data() {
    return {
      flag: false,
    };
  },
  mixins: [vuexData],
  mounted() {
    this.getShopNum(); // mixins 里  this.getShopNum
  },
};
</script>

<style lang="scss" scoped>
.list {
  display: flex; /*默认行显示*/
  justify-content: space-around; /*水平平均*/
  align-items: center; /*垂直居中*/
  height: 60px;
  .link {
    position: relative;
    flex: 1; /*百分比分栏 4列 width:25% */
    display: flex;
    flex-direction: column; /*列显示*/
    align-items: center; /*水平的居中*/
    span {
      padding: 4px 0;
    }
    &.router-link-active {
      color: rgb(231, 15, 15);
    }
    .iconfont {
      font-size: 22px;
      margin: 5px 0 0 0;
    }
  }
}
</style>
