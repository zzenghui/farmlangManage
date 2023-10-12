<template>
  <div>
    <QueryKeyword  v-if="queryType==0"  @reload="reload($event)"></QueryKeyword>
   <QuestionQuery   v-if="queryType==1" @reload="reload($event)"></QuestionQuery>
  </div>
</template>

<script>
  import QueryKeyword from './components/queryKeyword.vue';
  import QuestionQuery from './components/questionQuery.vue';
  export default {
    name:'query',
    props: {
      queryType: {
        type: Number,
        default: () => 0
      },
    },
    components: {
      QueryKeyword,
      QuestionQuery
    },
    data() {
      return {};
    },
    methods: {
      reload(event) {
        this.$emit('reload', event);
      }
    }

  }
</script>

<style>
</style>
