<template>
  <!-- 种植建档模板 -->
  <div class="schema">
    <div>
      <label>巡田人 </label>
      <span>{{ schemaObj.value4 }}</span>
    </div>
    <div>
      <label>巡田时间 </label>
      <span>{{ schemaObj.value2 }} </span>
    </div>
    <div>
      <label>巡田内容 </label>
      <span>{{ schemaObj.value3 }}</span>
    </div>
    <el-image
      class="img"
      v-for="(r, index) in schemaObj.value1"
      :key="index"
      :src="r.thumbPath"
      :preview-src-list="[r.path]"
    >
    </el-image>
  </div>
</template>

<script>
import { formType } from "../../constant";
export default {
  props: {
    schema: {}
  },
  watch: {
    schema: {
      handler(newV, oldV) {
        console.log(newV);
        let schemaObj = {};
        newV.map(e => {
          let value = e.value;
          if (e.type == formType.Album) {
            value = e.albumItems;
          }
          schemaObj["value" + e.id] = value;
        });
        this.schemaObj = schemaObj;
      },
      immediate: true
    }
  },
  data() {
    return {
      schemaObj: {}
    };
  }
};
</script>

<style lang="scss" scoped>
@import "./archive.scss";
</style>
