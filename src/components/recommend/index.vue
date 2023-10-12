<template>
  <div>
    <div class="correlation-item">
      <img :src="recommendData.img" alt=""/>
      <div class="item-style">
        <p>
          <i class="ele-text-primary">{{recommendData.season}}</i>
          <span class="zw">作物: {{recommendData.cropName}}</span>
        </p>
        <p>
          <span>农田区域: </span>
          <span>{{recommendData.area}}</span>
        </p>
        <p>
          <span>农田名称: </span>
          <span>{{recommendData.fieldName}}</span>
        </p>
        <p class="ts-p">
          <span>{{recommendData.name}} </span>
          <span>{{recommendData.time}} </span>
          <span class="el-icon-chat-line-square"></span>
          <span> {{recommendData.num}}</span>
        </p>
      </div>
    </div>
    <hr class="hr"/>
  </div>
</template>

<script>
export default {
  name: "index",
  props:['recommendData']
}
</script>

<style scoped lang="scss">
.correlation-item{
  height: 90px;
  display: flex;
img{
  width:198px;
  height: 90px;
}
p{
i{
  font-style: normal;
}
span{
  color: black;
}
.zw{
  margin-left: 10px;
}
}
.ts-p{
  font-size: 12px;
span{
  color:#606266;
}
}
.item-style{
  line-height:24px;
  margin-left: 20px;
}
}
.hr{
  height:1px;
  border:0;
  margin-top:10px;
  background-color:#D8D8D8;
}
</style>
