<template>
  <el-page-header class="page-header" @back="goBack"> </el-page-header>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
.page-header {
  background-color: #fff;
  padding: 20px;
}
</style>
