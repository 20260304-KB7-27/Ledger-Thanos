<template>
  <div class="main">
    <div class="header">
      <Box width="custom" custom-width="15%">
        <div class="box-label">주간/월간</div>
      </Box>
      <h3><span><</span> 2024년 8월 <span>></span></h3>
      <Box width="custom" customWidth="15%">
        <div class="box-label">PDF 내보내기</div>
      </Box>
    </div>
    <div>
      
    </div>
  </div>
</template>

<script setup>
import Box from '@/components/Box.vue';
</script>

<style scoped>
.main {
  padding: 30px 30px 0px 30px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-label {
  width: 100%;
  text-align: center;
}
</style>
