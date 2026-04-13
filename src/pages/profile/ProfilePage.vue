<template>
  <div class="profile-page">
    <section class="left-column">
      <!-- 사용자 프로필 -->
      <ProfileUserCard
        :profile="profile"
        :selected-badge="selectedBadge"
        :member-since-text="memberSinceText"
        :is-happy="isHappy"
        @open-edit="openProfileEditor"
      />

      <!-- 활동요약 -->
      <ProfileSummaryCard
        class="profile-summary-slot"
        :summary="summary"
        :is-happy="isHappy"
      />

      <!-- 로그아웃버튼 -->
      <button
        type="button"
        class="logout-button"
        :class="{ happy: isHappy }"
        @click="handleLogout"
      >
        로그아웃
      </button>
    </section>

    <section class="right-column">
      <!-- 칭호 선택 -->
      <ProfileTitleCard
        class="profile-title-slot"
        :earned-badges="earnedBadgeCatalog"
        :selected-title-keys="normalizedSelectedTitleKeys"
        @toggle-title="toggleTitle"
      />

      <!-- 모든 뱃지 -->
      <ProfileBadgeCollectionCard
        class="profile-badge-slot"
        :badge-catalog="badgeCatalog"
        :earned-badge-count="earnedBadgeCount"
      />
    </section>
  </div>

  <ProfileEditModal
    :is-open="isEditModalOpen"
    :nickname="profileEditForm.nickname"
    :user-location="profileEditForm.userLocation"
    :districts="seoulDistricts"
    :error-message="profileEditError"
    :is-saving="isSavingProfile"
    :is-happy="isHappy"
    @update:nickname="profileEditForm.nickname = $event"
    @update:user-location="profileEditForm.userLocation = $event"
    @close="closeProfileEditor"
    @save="saveProfile"
  />
</template>

<script setup>
/*
 * import
 */
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { tryCalculateBadges } from '@/pages/profile/js/badgeCalculator';
import { updateUserProfile } from '@/service/user/userApi';
import { useUserStore } from '@/stores/user';
import ProfileUserCard from '@/pages/profile/components/ProfileUserCard.vue';
import ProfileSummaryCard from '@/pages/profile/components/ProfileSummaryCard.vue';
import ProfileTitleCard from '@/pages/profile/components/ProfileTitleCard.vue';
import ProfileBadgeCollectionCard from '@/pages/profile/components/ProfileBadgeCollectionCard.vue';
import ProfileEditModal from '@/pages/profile/components/ProfileEditModal.vue';
import {
  buildProfileUpdatePayload,
  createProfileEditForm,
  getBadgeCatalog,
  getEarnedBadgeCount,
  getMemberSinceText,
  getNormalizedSelectedTitleKeys,
  getProfileInfo,
  getProfileSummary,
  getSelectedBadge,
  getSelectedTitleBadges,
  seoulDistricts,
  validateProfileEditForm,
} from '@/pages/profile/js/profile.js';

/*
 * store / router
 */
const router = useRouter();
const userStore = useUserStore();
const isHappy = computed(() => userStore.dominantEmotion === 'happy');

/*
 * 사용자 / 거래 기본 데이터
 */
const profile = computed(() => getProfileInfo(userStore.user));
const transactions = computed(() => userStore.transactions ?? []);

/*
 * 칭호 / 배지 표시용 계산값
 */
const normalizedSelectedTitleKeys = computed(() =>
  getNormalizedSelectedTitleKeys(profile.value.selectedTitle)
);

const earnedBadgeKeys = computed(() => {
  const badges = userStore.user?.earnedBadges;
  return Array.isArray(badges) ? badges : [];
});

const badgeCatalog = computed(() =>
  getBadgeCatalog(earnedBadgeKeys.value, normalizedSelectedTitleKeys.value)
);

const earnedBadgeCount = computed(() =>
  getEarnedBadgeCount(badgeCatalog.value)
);

const selectedTitleBadges = computed(() => {
  return getSelectedTitleBadges(
    badgeCatalog.value,
    normalizedSelectedTitleKeys.value
  );
});

const selectedBadge = computed(() =>
  getSelectedBadge(selectedTitleBadges.value)
);

// 획득한 배지만 추려서 칭호 선택 카드에 전달
const earnedBadgeCatalog = computed(() =>
  badgeCatalog.value.filter((b) => b.earned)
);

/*
 * 활동 요약 / 가입일 표시
 */
const summary = computed(() => getProfileSummary(transactions.value));
const memberSinceText = computed(() => getMemberSinceText(userStore.user));

/*
 * 프로필 수정 모달 상태
 */
const isEditModalOpen = ref(false);
const isSavingProfile = ref(false);
const profileEditError = ref('');
const profileEditForm = ref(createProfileEditForm(userStore.user));

/*
 * event
 */
const openProfileEditor = () => {
  profileEditForm.value = createProfileEditForm(userStore.user);
  profileEditError.value = '';
  isEditModalOpen.value = true;
};

const closeProfileEditor = () => {
  if (isSavingProfile.value) return;
  isEditModalOpen.value = false;
  profileEditError.value = '';
};

const saveProfile = async () => {
  const validationMessage = validateProfileEditForm(profileEditForm.value);

  if (validationMessage) {
    profileEditError.value = validationMessage;
    return;
  }

  try {
    isSavingProfile.value = true;
    profileEditError.value = '';

    const payload = buildProfileUpdatePayload(
      userStore.user,
      profileEditForm.value
    );

    const result = await updateUserProfile(userStore.user.id, payload);
    const updatedUser = result?.data ?? result;

    userStore.setUser(updatedUser);
    profileEditForm.value = createProfileEditForm(updatedUser);
    isEditModalOpen.value = false;
  } catch (error) {
    profileEditError.value =
      error?.message ?? '프로필 저장에 실패했어요. 잠시 후 다시 시도해주세요.';
  } finally {
    isSavingProfile.value = false;
  }
};

/*
 * 월말 배지 자동 계산
 */
onMounted(() => {
  tryCalculateBadges(
    transactions.value,
    userStore.user,
    (updatedUser) => userStore.setUser(updatedUser),
  );
});

const toggleTitle = async (key) => {
  const current = normalizedSelectedTitleKeys.value;
  const next = current.includes(key) ? [] : [key];

  const result = await updateUserProfile(userStore.user.id, {
    ...userStore.user,
    selectedTitle: next,
  });
  userStore.setUser(result?.data ?? result);
};

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(320px, 0.88fr) minmax(0, 1.62fr);
  align-items: flex-start;
  gap: 34px;
  padding: 32px 38px;
  box-sizing: border-box;
  background: var(--page-bg-profile);
}

.left-column {
  width: auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.right-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.profile-summary-slot,
.profile-title-slot,
.profile-badge-slot {
  min-height: 0;
}

.profile-summary-slot {
  flex: 0 0 auto;
}

.profile-title-slot {
  flex: 0 0 auto;
}

.profile-badge-slot :deep(.common-box),
.profile-badge-slot :deep(.box-content),
.profile-badge-slot :deep(.collection-card),
.profile-summary-slot :deep(.common-box),
.profile-summary-slot :deep(.box-content),
.profile-summary-slot :deep(.summary-card) {
  height: 100%;
}

.profile-badge-slot .collection-card {
  min-height: 100%;
  box-sizing: border-box;
}

.profile-badge-slot {
  flex: 1 1 auto;
  min-height: 0;
}

.logout-button {
  width: 100%;
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-button);
  background: var(--button-danger-bg);
  color: var(--button-danger-text);
  font-size: 28px;
  font-weight: 800;
  padding: 20px 24px;
  cursor: pointer;
  box-shadow: var(--shadow-button);
  transition: var(--btn-transition);
}

.logout-button.happy {
  background: var(--happy-main-pink);
  color: #ffffff;
}

.logout-button:hover {
  transform: var(--btn-hover-lift);
}

.logout-button:active {
  transform: var(--btn-active-lift);
}

@media (min-width: 1500px) {
  .profile-page {
    grid-template-columns: minmax(340px, 0.9fr) minmax(0, 1.7fr);
    gap: 36px;
    padding: 36px 40px;
  }

  .left-column,
  .right-column {
    min-height: calc(100vh - 72px);
  }

  .profile-summary-slot {
    flex: 1 1 auto;
  }
}

@media (max-width: 1024px) {
  .profile-page {
    display: flex;
    flex-direction: column;
    padding: 24px;
  }

  .left-column,
  .right-column {
    width: 100%;
    min-height: auto;
  }
}

@media (max-width: 640px) {
  .profile-page {
    padding: 16px;
    gap: 20px;
  }

  .left-column,
  .right-column {
    gap: 20px;
  }

  .logout-button {
    font-size: 20px;
    padding: 18px 20px;
  }
}
</style>
