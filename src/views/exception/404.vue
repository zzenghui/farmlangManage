<template>
  <div :class="classes">
    <div class="ele-exception-img">
      <img src="@/assets/ic-404.svg" alt="" width="305px" height="245px">
    </div>
    <div class="ele-exception-content ele-text-left">
      <h1 class="ele-text">404</h1>
      <p class="ele-text-secondary">抱歉，你访问的页面不存在</p>
      <div>
        <el-button
          type="primary"
          @click="$router.push('/login')">返回登录页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Exception404',
  computed: {
    classes() {
      return [
        'ele-exception ele-text-center',
        {'ele-exception-dark': this.$store.state.theme.darkMode}
      ];
    }
  }
}
</script>
