<template>
  <!-- 总模板 -->
  <component
    :is="`archive${record.archiveId - 1}`"
    :schema="record.schema"
    :record="record"
  ></component>
</template>

<script>
import archive1 from "./archive1.vue";
import archive2 from "./archive2.vue";
import archive3 from "./archive3.vue";

export default {
  components: {
    archive1,
    archive2,
    archive3
  },
  props: {
    record: {}
  },
  mounted() {
    console.log(this.record);
  }
};
</script>

<style lang="scss" scoped>
@import "./archive.scss";
</style>
