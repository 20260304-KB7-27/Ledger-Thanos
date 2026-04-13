import { ref, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import html2canvas from 'html2canvas';

/**
 * useEasterEggSequence
 *
 * 4단계 이스터에그 애니메이션 시퀀스를 오케스트레이션하는 Composable.
 * 파티클 분해 → 게이지 전환 → 우주 신기루 → 환상의 붕괴 순으로 진행.
 *
 * @param {Object} opts
 * @param {import('vue').Ref<number>} opts.emotionRateDisplay - ProgressBar에 바인딩된 ref
 * @param {import('vue').ComputedRef<number>} opts.emotionSatisfiedRate - 원본 감정 만족도
 */
export function useEasterEggSequence({
  emotionRateDisplay,
  emotionRatioDisplay,
  emotionSatisfiedRate,
  progressBarRef,
}) {
  const isPlaying = ref(false);

  // 정리 대상 리소스 추적
  const _rafIds = [];
  const _canvases = [];
  let _gsapTween = null;
  let _originalThemeClass = '';
  let _mounted = true;

  // ─────────────────────────────────────────────
  // 내부 유틸리티
  // ─────────────────────────────────────────────

  /** RAF 등록 + 취소 목록 추적 */
  function scheduleRaf(fn) {
    let id;
    const loop = (time) => {
      if (!_mounted) return;
      const shouldContinue = fn(time);
      if (shouldContinue) id = requestAnimationFrame(loop);
      else {
        const idx = _rafIds.indexOf(id);
        if (idx !== -1) _rafIds.splice(idx, 1);
      }
    };
    id = requestAnimationFrame(loop);
    _rafIds.push(id);
    return () => {
      cancelAnimationFrame(id);
      const idx = _rafIds.indexOf(id);
      if (idx !== -1) _rafIds.splice(idx, 1);
    };
  }

  /** Promise로 감싼 setTimeout */
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** html2canvas로 엘리먼트 캡처 → ImageData 반환 */
  async function captureElement(el) {
    const canvas = await html2canvas(el, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 1,
      logging: false,
    });
    const ctx = canvas.getContext('2d');
    return {
      imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
      width: canvas.width,
      height: canvas.height,
      rect: el.getBoundingClientRect(),
    };
  }

  // ─────────────────────────────────────────────
  // 파티클 시스템
  // ─────────────────────────────────────────────

  /**
   * imageData로부터 파티클 배열 생성
   * @param {ImageData} imageData
   * @param {number} srcWidth  - 캡처된 canvas width
   * @param {number} srcHeight - 캡처된 canvas height
   * @param {DOMRect} rect     - 원본 엘리먼트 위치 (viewport 기준)
   * @param {'up'|'explode'} direction - 파티클 날아가는 방향
   */
  function buildParticles(
    imageData,
    srcWidth,
    srcHeight,
    rect,
    direction = 'up'
  ) {
    const particles = [];
    const data = imageData.data;
    const SAMPLE = 6; // 몇 픽셀 간격으로 샘플링
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let py = 0; py < srcHeight; py += SAMPLE) {
      for (let px = 0; px < srcWidth; px += SAMPLE) {
        const idx = (py * srcWidth + px) * 4;
        const a = data[idx + 3];
        if (a < 30) continue; // 거의 투명한 픽셀 스킵

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // 실제 화면 좌표
        const x = rect.left + (px / srcWidth) * rect.width;
        const y = rect.top + (py / srcHeight) * rect.height;

        let vx, vy;
        if (direction === 'up') {
          vx = (Math.random() - 0.5) * 5;
          vy = -(Math.random() * 4 + 1.5);
        } else {
          // explode: 중심에서 바깥쪽으로
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const speed = Math.random() * 5 + 2;
          vx = (dx / dist) * speed;
          vy = (dy / dist) * speed;
        }

        particles.push({
          x,
          y,
          vx,
          vy,
          opacity: 1,
          size: Math.random() * 2 + 1.5,
          color: `rgb(${r},${g},${b})`,
          decay: Math.random() * 0.018 + 0.012,
        });
      }
    }
    return particles;
  }

  /**
   * 파티클 캔버스를 body에 마운트하고 RAF 루프 시작
   * resolve는 모든 파티클이 사라지면 호출
   */
  function runParticleAnimation(particles) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9000;
      `;
      document.body.appendChild(canvas);
      _canvases.push(canvas);

      const ctx = canvas.getContext('2d');
      let active = particles;

      const stop = scheduleRaf(() => {
        if (!_mounted) {
          resolve();
          return false;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        active = active.filter((p) => p.opacity > 0);
        if (active.length === 0) {
          canvas.remove();
          const idx = _canvases.indexOf(canvas);
          if (idx !== -1) _canvases.splice(idx, 1);
          resolve();
          return false; // RAF 중지
        }

        active.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08; // 중력
          p.opacity -= p.decay;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.globalAlpha = 1;
        return true; // 계속
      });

      void stop; // 명시적 사용 억제
    });
  }

  // ─────────────────────────────────────────────
  // Phase 1 — 후회 거래 파티클 분해
  // ─────────────────────────────────────────────

  async function runPhase1() {
    const regretEls = Array.from(
      document.querySelectorAll('[data-emotion="regret"]')
    );
    if (regretEls.length === 0) return;

    const capturePromises = regretEls.map(async (el) => {
      const { imageData, width, height, rect } = await captureElement(el);
      // 원본 즉시 숨기기
      el.style.transition = 'opacity 0.2s';
      el.style.opacity = '0';
      return buildParticles(imageData, width, height, rect, 'up');
    });

    const particleGroups = await Promise.all(capturePromises);
    const allParticles = particleGroups.flat();

    await runParticleAnimation(allParticles);
  }

  // ─────────────────────────────────────────────
  // Phase 2 — 게이지 100% 트랜지션 (Phase 1과 동시)
  // ─────────────────────────────────────────────

  function runPhase2() {
    // 게이지 바: 0 → 100
    gsap.to(emotionRateDisplay, {
      value: 100,
      duration: 3.5,
      ease: 'power1.inOut',
    });

    // 비율 텍스트: 현재값 → 100000 (과장된 상승)
    const proxy = { val: emotionRatioDisplay.value };
    return new Promise((resolve) => {
      _gsapTween = gsap.to(proxy, {
        val: 100000,
        duration: 3.5,
        ease: 'power2.in',
        onUpdate() {
          emotionRatioDisplay.value = Math.round(proxy.val);
        },
        onComplete: resolve,
      });
    });
  }

  // ─────────────────────────────────────────────
  // Phase 3 — 우주 신기루 + 테마 전환
  // ─────────────────────────────────────────────

  function buildCosmosData(w, h) {
    const STAR_COUNT = 220;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 2 + 0.5,
      color: ['#ffffff', '#ffe5d5', '#d5eaff', '#ffd5ff', '#d5ffe5'][
        Math.floor(Math.random() * 5)
      ],
    }));

    const nebulae = [
      { x: w * 0.2, y: h * 0.3, r: w * 0.28, color: 'rgba(120,40,180,0.35)' },
      { x: w * 0.75, y: h * 0.6, r: w * 0.22, color: 'rgba(40,80,200,0.3)' },
      { x: w * 0.5, y: h * 0.8, r: w * 0.35, color: 'rgba(200,60,120,0.25)' },
      { x: w * 0.85, y: h * 0.15, r: w * 0.18, color: 'rgba(60,180,160,0.2)' },
      { x: w * 0.1, y: h * 0.75, r: w * 0.2, color: 'rgba(255,140,60,0.18)' },
    ];

    // 유성 상태
    const meteors = [];
    return { stars, nebulae, meteors };
  }

  function spawnMeteor(w, h, meteors) {
    if (Math.random() > 0.015) return; // 확률적으로 생성
    meteors.push({
      x: Math.random() * w,
      y: Math.random() * h * 0.4,
      vx: Math.random() * 6 + 3,
      vy: Math.random() * 3 + 1.5,
      length: Math.random() * 80 + 40,
      opacity: 1,
    });
  }

  function runPhase3(showOverlay) {
    return new Promise((resolve) => {
      // 테마 전환
      const app = document.getElementById('app');
      _originalThemeClass = [...app.classList].find((c) =>
        c.startsWith('theme-')
      );
      app.classList.remove('theme-regret', 'theme-neutral', 'theme-happy');
      app.classList.add('theme-happy');

      // 오버레이 표시
      showOverlay();

      // 코스믹 캔버스 생성
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // 게이지 바 중심 좌표 계산 (없으면 화면 중앙)
      let originX = window.innerWidth / 2;
      let originY = window.innerHeight / 2;
      if (progressBarRef?.value) {
        const rect = progressBarRef.value.getBoundingClientRect();
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      }

      canvas.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 8000;
        pointer-events: none;
        clip-path: circle(0px at ${originX}px ${originY}px);
      `;
      document.body.appendChild(canvas);
      _canvases.push(canvas);

      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      const { stars, nebulae, meteors } = buildCosmosData(w, h);

      // 게이지 바에서 원형으로 확장
      requestAnimationFrame(() => {
        canvas.style.transition = 'clip-path 1.1s cubic-bezier(0.4, 0, 0.2, 1)';
        canvas.style.clipPath = `circle(200vmax at ${originX}px ${originY}px)`;
      });

      let startTime = null;
      const HOLD_DURATION = 2520; // ms

      const stop = scheduleRaf((timestamp) => {
        if (!_mounted) {
          resolve();
          return false;
        }
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        ctx.fillStyle = '#1a0a35';
        ctx.fillRect(0, 0, w, h);

        // 성운
        nebulae.forEach((n) => {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
          grd.addColorStop(0, n.color);
          grd.addColorStop(1, 'transparent');
          ctx.globalAlpha = 1;
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, w, h);
        });

        // 별 반짝임
        stars.forEach((s) => {
          const alpha = 0.4 + 0.6 * Math.sin((elapsed / 1000) * s.speed);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // 유성
        spawnMeteor(w, h, meteors);
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          ctx.globalAlpha = m.opacity;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(
            m.x - m.vx * (m.length / 10),
            m.y - m.vy * (m.length / 10)
          );
          ctx.stroke();
          m.x += m.vx;
          m.y += m.vy;
          m.opacity -= 0.02;
          if (m.opacity <= 0) meteors.splice(i, 1);
        }

        ctx.globalAlpha = 1;

        if (elapsed >= HOLD_DURATION) {
          resolve();
          return false;
        }
        return true;
      });

      void stop;
    });
  }

  // ─────────────────────────────────────────────
  // 색상 워시 — 파티클 후 여운 구간 배경 색 전환
  // ─────────────────────────────────────────────

  function showColorWash(duration) {
    return new Promise((resolve) => {
      const targets = [
        document.querySelector('.main'),
        document.querySelector('.sidebar'),
        document.querySelector('.topbar'),
        document.querySelector('.mobile-header'),
      ].filter(Boolean);

      if (targets.length === 0) return delay(duration).then(resolve);

      const styleEl = document.createElement('style');
      styleEl.textContent = `
        @keyframes _egg_color_wash {
          0%   { background: #e8d5ff; }
          20%  { background: #d5e8ff; }
          40%  { background: #ffd5f5; }
          60%  { background: #d5fff0; }
          80%  { background: #fff5d5; }
          100% { background: #e8d5ff; }
        }
      `;
      document.head.appendChild(styleEl);

      const prevStyles = targets.map((el) => ({
        animation: el.style.animation,
        background: el.style.background,
      }));

      targets.forEach((el) => {
        el.style.animation = `_egg_color_wash ${duration}ms ease-in-out forwards`;
      });

      setTimeout(() => {
        targets.forEach((el, i) => {
          el.style.animation = prevStyles[i].animation;
          el.style.background = prevStyles[i].background;
        });
        styleEl.remove();
        resolve();
      }, duration);
    });
  }

  // ─────────────────────────────────────────────
  // Phase 4 — 환상의 붕괴 및 롤백
  // ─────────────────────────────────────────────

  async function runPhase4(hideOverlay) {
    // 우주 캔버스들 — 원형 축소로 닫기
    _canvases.forEach((c) => {
      const current = c.style.clipPath;
      const originMatch = current.match(/at\s+([\d.]+)px\s+([\d.]+)px/);
      const ox = originMatch ? originMatch[1] : window.innerWidth / 2;
      const oy = originMatch ? originMatch[2] : window.innerHeight / 2;
      c.style.transition = 'clip-path 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      c.style.clipPath = `circle(0px at ${ox}px ${oy}px)`;
    });

    // body 전체 캡처 후 파티클 폭발
    const { imageData, width, height, rect } = await captureElement(
      document.body
    );
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const bodyRect = {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const particles = buildParticles(
      imageData,
      width,
      height,
      bodyRect,
      'explode'
    );

    // 파티클 수 제한 (퍼포먼스)
    const LIMITED = particles.filter(() => Math.random() < 0.25);

    await runParticleAnimation(LIMITED);

    // 파티클 종료 후 여운 — 배경색 흐름 효과
    await showColorWash(5000);

    // 오버레이 숨기기 + 복원
    hideOverlay();

    const app = document.getElementById('app');
    app.classList.remove('theme-happy');
    if (_originalThemeClass) app.classList.add(_originalThemeClass);

    // 후회 거래 카드 opacity 복원
    document.querySelectorAll('[data-emotion="regret"]').forEach((el) => {
      el.style.transition = 'opacity 0.6s ease';
      el.style.opacity = '1';
    });

    // 게이지 + 비율 텍스트 원래 값으로 복원
    const proxy = { val: emotionRatioDisplay.value };
    _gsapTween = gsap.to(proxy, {
      val: emotionSatisfiedRate.value,
      duration: 1.2,
      ease: 'power1.inOut',
      onUpdate() {
        emotionRatioDisplay.value = Math.round(proxy.val);
      },
    });
    gsap.to(emotionRateDisplay, {
      value: emotionSatisfiedRate.value,
      duration: 1.2,
      ease: 'power1.inOut',
    });
  }

  // ─────────────────────────────────────────────
  // 메인 시퀀스 오케스트레이터
  // ─────────────────────────────────────────────

  /**
   * @param {() => void} showOverlay - EasterEggOverlay를 화면에 표시하는 콜백
   * @param {() => void} hideOverlay - EasterEggOverlay를 숨기는 콜백
   */
  async function triggerSequence(showOverlay, hideOverlay) {
    if (isPlaying.value) return;
    isPlaying.value = true;

    try {
      // Phase 1 + Phase 2 동시 진행
      await Promise.all([runPhase1(), runPhase2()]);

      // 짧은 여운
      await delay(300);

      // Phase 3
      await runPhase3(showOverlay);

      // Phase 4
      await runPhase4(hideOverlay);
    } catch (e) {
      console.warn('[EasterEgg] 시퀀스 중 오류:', e);
      cleanup();
    } finally {
      isPlaying.value = false;
    }
  }

  // ─────────────────────────────────────────────
  // 클린업
  // ─────────────────────────────────────────────

  function cleanup() {
    _mounted = false;

    _rafIds.forEach((id) => cancelAnimationFrame(id));
    _rafIds.length = 0;

    _canvases.forEach((c) => c.remove());
    _canvases.length = 0;

    if (_gsapTween) {
      _gsapTween.kill();
      _gsapTween = null;
    }

    // 테마 복원
    if (_originalThemeClass) {
      const app = document.getElementById('app');
      if (app) {
        app.classList.remove('theme-regret', 'theme-neutral', 'theme-happy');
        app.classList.add(_originalThemeClass);
      }
    }

    // 거래 카드 opacity 복원
    document.querySelectorAll('[data-emotion="regret"]').forEach((el) => {
      el.style.opacity = '';
      el.style.transition = '';
    });

    // 게이지 즉시 복원
    emotionRateDisplay.value = emotionSatisfiedRate.value;
    emotionRatioDisplay.value = emotionSatisfiedRate.value;

    isPlaying.value = false;
  }

  onUnmounted(cleanup);

  return { isPlaying, triggerSequence };
}
