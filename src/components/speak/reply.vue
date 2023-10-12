<template>
  <div v-if="sayData" class="component">
    <div class="item">
      <img :src="sayData.img || sayData.user.avatar" alt="图片加载失败" />
      <p v-text="sayData.name || sayData.user.name"></p>
      <p v-text="sayData.no || sayData.user.no"></p>
      <p v-if="positionTime === 'right'" v-text="sayData.time"></p>
      <p v-if="sayData.content">
        {{ sayData.content }}
      </p>
    </div>
    <slot name="img"></slot>
    <p v-if="positionTime === 'bottom'">
      {{ sayData.time || sayData.createAt }}
      <!-- <p v-if="!showReply">回复</p> -->
      <slot name="reply"> </slot>
    </p>
    <slot></slot>
    <!-- <speak
      style="padding: 0"
      v-if="sayData.replys && sayData.replys.length > 0"
      :sayData="sayData.replys"
    /> -->
  </div>
</template>

<script>
export default {
  name: "speak",
  props: ["positionTime", "sayData"]
};
</script>

<style scoped lang="scss">
.component {
  .item {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    p {
      color: black;
      font-size: 14px;
      margin-left: 10px;
    }
  }
  p {
    color: #b2b2b2;
    font-size: 12px;
    margin-left: 34px;
  }
}
</style>
