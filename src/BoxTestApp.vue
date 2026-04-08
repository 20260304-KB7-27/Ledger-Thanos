<template>
  <div class="test-viewport">
    <h2>📦 로컬 폰트 + Box 전체 규격 통합 테스트</h2>
    <p>
      모든 박스의 제약 조건(규격, 마진, 테두리, 그림자 등)과 로컬 폰트가
      정상적으로 공존하는지 확인하십시오.
    </p>

    <Box
      width="small"
      bgColor="#f0fdf4"
      border="2px solid #22c55e"
      fontFamily="'NPS', sans-serif"
    >
      <h3>1. Small Box</h3>
      <p>가로 300px, 굵은 초록색 테두리입니다.</p>
      <p>로컬 폰트가 좁은 박스 안에서도 예쁘게 렌더링됩니까?</p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis iste,
        quae eligendi, incidunt ex, consectetur sequi nesciunt quis voluptate
        odit cupiditate? Corporis error iste, soluta a itaque laborum architecto
        voluptatum officia molestiae illo nulla repellat optio temporibus minus,
        dicta quisquam dolorum in repellendus dolore aperiam alias perferendis
        laboriosam reiciendis. Quam.
      </p>
    </Box>

    <Box
      width="middle"
      marginY="40px"
      :shadow="false"
      bgColor="#f8fafc"
      fontFamily="'NPS', sans-serif"
    >
      <h3>2. Middle Box (그림자 OFF)</h3>
      <p>가로 500px, 위아래 마진 40px입니다.</p>
      <p>내용이 길어져도, 로컬 폰트의 크기와 줄바꿈에 맞춰</p>
      <p>박스의 세로 길이가 아주 유연하게 늘어납니다!</p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum maiores
        asperiores accusantium reprehenderit, ratione, doloribus consectetur quo
        et accusamus eligendi praesentium culpa nihil non maxime! Id obcaecati
        animi quae quam, culpa voluptates sequi eum sunt quod corporis aut
        voluptatibus dicta facilis nobis! Exercitationem modi nam officia,
        molestiae placeat suscipit facilis.
      </p>
    </Box>

    <Box
      width="big"
      border="none"
      bgColor="#fff1f2"
      fontFamily="'NPS', sans-serif"
    >
      <h3>3. Big Box (테두리 없음)</h3>
      <p>가로 800px. 테두리(border)를 없애고 그림자만 남겼습니다.</p>
      <p>넓은 공간에서 로컬 폰트를 쾌적하게 읽어 보십시오.</p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti
        mollitia dolore laboriosam, eaque eveniet dolorum, sint vero animi
        possimus deserunt molestias quas quaerat illo perspiciatis ipsa hic? Ab
        quod totam id provident debitis ipsa aliquam animi consectetur aliquid?
        Necessitatibus dolorem ipsam doloribus totam nulla! Ut, impedit sit nisi
        non at vero unde quo iusto asperiores facilis ab voluptatibus voluptatem
        eveniet, deserunt dolorum maiores optio aspernatur adipisci libero? Sunt
        quae alias optio quis sit quo voluptatum.
      </p>
    </Box>

    <Box
      width="custom"
      customWidth="90%"
      marginY="24px"
      border="2px dashed #3b82f6"
      bgColor="#eff6ff"
      fontFamily="'NPS', sans-serif"
    >
      <h3>4. Custom Box (가로 90%)</h3>
      <p>
        화면 너비의 90%를 차지하는 커스텀 규격입니다. 점선 테두리 안에서도
        폰트는 완벽하게 작동합니다.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur aut
        aperiam reprehenderit. At sunt ab voluptatibus vel veritatis repudiandae
        hic totam dolorem repellat eos explicabo, fugiat laborum quas sit
        molestiae magnam dolorum dolor. Sed perspiciatis odio consectetur magnam
        officia quasi error, ducimus aspernatur! Maxime in commodi officia quia
        possimus, sequi mollitia esse, amet illo dolore voluptas ipsam quas
        aliquid odio adipisci neque impedit libero. Sint temporibus quibusdam
        non hic accusamus iste at debitis ex excepturi?
      </p>
    </Box>
  </div>
</template>

<script setup>
import Box from './components/Box.vue';
</script>

<style scoped>
@font-face {
  font-family: 'NPS';
  src: url('@/assets/fonts/NPSfont_regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.test-viewport {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px;
  background-color: #f1f5f9;
  min-height: 100vh;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h2,
h3,
p {
  margin: 12px 0;
}
h2,
p {
  text-align: center;
}
</style>
