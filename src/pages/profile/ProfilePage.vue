<template>
  <div class="profile-page">
    <section class="left-column">
      <!-- 사용자 프로필 -->
      <ProfileUserCard
        :profile="profile"
        :selected-badge="selectedBadge"
        :member-since-text="memberSinceText"
        @open-edit="openProfileEditor"
      />

      <!-- 활동요약 -->
      <ProfileSummaryCard :summary="summary" />

      <!-- 로그아웃버튼 -->
      <button type="button" class="logout-button" @click="handleLogout">
        로그아웃
      </button>
    </section>

    <section class="right-column">
      <!-- 칭호 선택 -->
      <ProfileTitleCard
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
@font-face {
  font-family: 'NPS';
  src: url('@/assets/fonts/NPSfont_regular.ttf') format('truetype');
  font-weight: 400;
}

@font-face {
  font-family: 'NPS';
  src: url('@/assets/fonts/NPSfont_bold.ttf') format('truetype');
  font-weight: 700;
}

@font-face {
  font-family: 'NPS';
  src: url('@/assets/fonts/NPSfont_extrabold.ttf') format('truetype');
  font-weight: 800;
}

.profile-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  gap: 34px;
  padding: 32px 38px;
  box-sizing: border-box;
  background: #f9f0c9;
  font-family: 'NPS', sans-serif;
}

.left-column {
  width: 324px;
  flex: 0 0 324px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.right-column {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.profile-badge-slot :deep(.common-box),
.profile-badge-slot :deep(.box-content) {
  height: 100%;
}

.profile-badge-slot .collection-card {
  min-height: 100%;
  box-sizing: border-box;
}

.logout-button {
  width: 100%;
  border: none;
  border-radius: 999px;
  background: #ff8578;
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
  padding: 20px 24px;
  cursor: pointer;
  box-shadow: 0 5px 8px rgba(196, 112, 93, 0.24);
}

@media (max-width: 1024px) {
  .profile-page {
    flex-direction: column;
    padding: 24px;
  }

  .left-column,
  .right-column {
    width: 100%;
    flex-basis: auto;
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
