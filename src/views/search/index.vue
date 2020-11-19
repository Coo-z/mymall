<template>
  <div class="content">
    <transition name="search">
      <div class="box">
        <header class="g-header-container">
          <!--头部导航 nav-bar 组件-->
          <nav-bar class="nav">
            <!--可以更改插槽坑的内容-->
            <span
              slot="left"
              class="iconfont icon-fanhui"
              @click="goback"
            ></span>
            <div class="search" slot="center">
              <i class="fangd"></i>
              <input
                type="text"
                class="key"
                title="搜索框"
                placeholder="商品5折"
                ref="input"
                v-model="query"
                @change="searchHistory()"
              />
            </div>
            <span slot="right">
              <div v-if="listType == 1">
                <img
                  class="show-type"
                  src="@/assets/icon/list1.svg"
                  @click="changeShowType"
                />
              </div>
              <div v-else>
                <img
                  class="show-type"
                  src="@/assets/icon/list2.svg"
                  @click="changeShowType"
                />
              </div>
            </span>
          </nav-bar>
        </header>
      </div>
    </transition>
    <search-history
      ref="history"
      @keywordEnd="getkeyword"
      v-if="this.query == ''"
    />
    <search-result
      :query="query"
      :listType="listType"
      v-if="this.query != ''"
    />
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
import SearchHistory from "./history";
import SearchResult from "./result";
import navBar from "@/components/navbar";
import { debounce } from "@/assets/js/util";
import storage from "@/assets/js/storage.js"; // set(),get(),remove(),clear()
export default {
  name: "search",
  components: {
    navBar,
    SearchHistory,
    SearchResult,
  },
  data() {
    return {
      listType: 1,
      query: "",
    };
  },
  methods: {
    getkeyword(x) {
      this.query = x;
    },
    searchHistory() {
      var keyword = this.query;
      // 先拿本地存储
      let keywords = storage.get("historys") || [];
      if (keywords.length !== 0) {
        //将keywords在旧值中过滤，将相同的旧值去掉，重新添加keyword（放到最前面）
        keywords = keywords.filter((val) => val !== keyword);
      }
      keywords.unshift(keyword);
      // 存本地存储
      storage.set("historys", keywords);
    },
    goback() {
      this.$router.back();
    },
    changeShowType() {
      if (this.listType == 1) {
        this.listType = 2;
      } else {
        this.listType = 1;
      }
    },
  },
};
</script>

<style lang="css" scoped>
.container-body {
  background-color: white;
}
.show-type {
  width: 20px;
  height: 20px;
  margin-left: 20px;
}

/*头部导航样式*/
.nav {
  background-color: white;
}
.search {
  position: relative;
  display: flex;
  padding: 10px 0 10px 75px;
  border: 1px solid grey;
  border-radius: 20px;
  background-color: hsla(0, 17%, 98%, 0.74);
}
.search .key {
  flex: 1;
  border: 0;
  font-size: 17px;
  background-color: hsla(0, 17%, 98%, 0.74);
  margin-right: 5px;
  margin-left: -15px;
}
.search .jd-logo {
  display: inline-block;
  position: absolute;
  left: 10px;
  top: 10px;
  width: 20px;
  height: 15px;
  background: url(~@/assets/images/log.png) no-repeat;
  background-size: 20px 15px;
}
.search .fangd {
  display: inline-block;
  position: absolute;
  left: 20px;
  top: 12px;
  width: 18px;
  height: 15px;
  background: url(~@/assets/images/icon.png) no-repeat -80px 0;
  background-size: 200px;
  margin: 0 0 0 6px;
}
.search-enter-active,
.search-leave-active {
  transition: all 0.3s;
}

.search-enter,
.search-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
