<template>
  <div class="container">
    <div class="container-body">
      <router-view />
    </div>
    <div class="footer" v-show="isTabbarShow">
      <tab-bar></tab-bar>
    </div>
  </div>
</template>
<script>
import { vuexData } from "@/assets/js/mixin";
import tabBar from "@/components/tabbar.vue";
export default {
  name: "App",
  mixins: [vuexData],
  components: {
    tabBar,
  },
};
</script>
<style lang="scss">
</style>
