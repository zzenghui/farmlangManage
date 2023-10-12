<!-- 页脚 -->
<template>
  <div class="ele-text-center" style="padding: 16px 0;">
    <a :href="systemInfo.copyrightUrl" class="ele-text-secondary" style="margin-top: 8px;">
      {{ systemInfo.copyright }} 
    </a>
    <div class="ele-text-secondary">版本：{{ version }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'EleFooter',
  data() {
    return {
      version:''
    }
  },
  computed:{
    ...mapState({
      systemInfo:state=>state.user.systemInfo
    })
  },
  created() {
    this.version = process.env.VUE_APP_VERSION
  },
}
</script>
