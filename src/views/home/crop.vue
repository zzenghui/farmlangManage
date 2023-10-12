<template>
  <el-card shadow="never">
    <div slot="header" class="header ele-cell">
      <span class="ele-cell-content">各农作物占比</span>
    </div>
    <div class="chart-wrap" v-if="data.length > 0">
      <ele-chart
        :option="chartOption"
        class="chart"
        ref="chart"
        :click="handleClick"
      />
      <div class="current" v-if="currCrop">
        {{ currCrop.name }}
        <span @click="handleBack">返回</span>
      </div>
    </div>
    <empty v-else class="chart" />
  </el-card>
</template>

<script>
import EleChart from "ele-admin/packages/ele-chart";
import empty from "@/components/empty";

export default {
  components: { EleChart, empty },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      data: [],
      prevData: [],
      currCrop: null,
      prevCrop: null
    };
  },
  watch: {
    value() {
      this.data = this.value;
    }
  },
  computed: {
    chartOption() {
      const data = this.data.map(e => {
        e.value = e.num;
        return e;
      });
      return {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {d}% {c}亩"
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          left: "60%",
          top: "center",
          itemWidth: 10,
          itemHeight: 10,
          icon: "circle",
          formatter: name => {
            let value, precent;
            data.forEach(e => {
              if (e.name == name) {
                value = e.value;
                precent = e.percentage;
              }
            });
            let arr = [
              `{name|${name}}`
              // `{precent|| ${precent.toFixed(2)}%}`,
              // `{value|${value.toFixed(2)}亩}`
            ];
            return arr.join("");
          },
          textStyle: {
            rich: {
              name: {},
              precent: {},
              value: {}
            }
          }
        },
        series: [
          {
            name: "农作物占比",
            type: "pie",
            radius: ["45%", "65%"],
            center: ["35%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2
            },
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "16",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      };
    }
  },
  methods: {
    handleClick(e) {
      if (!this.data[e.dataIndex].children) return;
      this.prevCrop = this.currCrop;
      this.currCrop = e.data;
      this.prevData = this.data;
      this.data = this.data[e.dataIndex].children;
    },
    handleBack() {
      this.currCrop = this.prevCrop;
      this.prevCrop = null;
      this.data = this.prevData;
      this.prevData = this.value;
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  padding: 8px 0;
}
.chart {
  height: 250px;
}
.chart-wrap {
  position: relative;
  .current {
    position: absolute;
    bottom: 0;
    left: 35%;
    transform: translateX(-50%);
  }
  span {
    color: #66974d;
    border-bottom: 1px solid #66974d;
    cursor: pointer;
  }
}
</style>
