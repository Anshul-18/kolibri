<template>

  <SidePanelModal
    alignment="right"
    sidePanelWidth="700px"
    closeButtonIconType="close"
    @closePanel="closeSidePanel"
    @shouldFocusFirstEl="() => null"
  >
    <template #header>
      <div :class="{ 'back-button-class': !showSearch }">
        <KIconButton
          v-if="!showSearch"
          icon="back"
          class="back-button-style"
          @click="showSearch = true"
        />
        <h1 class="side-panel-title">
          {{ !showSearch ? searchLabel$() : $tr('manageLessonResourcesTitle') }}
        </h1>
      </div>
    </template>

    <div v-if="!showSearch">
      <SearchFiltersPanel
        ref="SearchPanel"
        v-model="searchTerms"
        :accordion="true"
        :showChannels="true"
        :showActivities="true"
        @close="showSearch = true"
      />
    </div>
    <div v-else>
      <div v-if="loading">
        <KCircularLoader />
      </div>
      <div v-else>
        <div v-if="bookmarks.length > 0">
          <h2 class="side-panel-subtitle">
            {{ selectFromBookmarks$() }}
          </h2>
          <KCardGrid layout="1-1-1">
            <KCard
              :title="bookmarksLabel$()"
              :headingLevel="3"
              :to="{}"
              orientation="horizontal"
              thumbnailDisplay="large"
              thumbnailAlign="right"
              :style="{
                height: '172px',
              }"
            >
              <template #thumbnailPlaceholder>
                <KIcon
                  :style="{
                    fontSize: '48px',
                  }"
                  icon="bookmark"
                  :color="$themePalette.grey.v_700"
                />
              </template>
              <template #belowTitle>
                <span>
                  {{ numberOfBookmarks$({ count: bookmarks.length }) }}
                </span>
              </template>
            </KCard>
          </KCardGrid>
        </div>
        <div>
          <div class="channels-header">
            <h2 class="side-panel-subtitle">
              {{ selectFromChannels$() }}
            </h2>
            <KButton
              icon="filter"
              :text="searchLabel$()"
              @click="showSearch = false"
            />
          </div>
          <KCardGrid layout="1-1-1">
            <AccessibleChannelCard
              v-for="channel of channels"
              :key="channel.id"
              :contentNode="channel"
              :to="{}"
              :headingLevel="3"
            />
          </KCardGrid>
        </div>
      </div>
    </div>

    <template #bottomNavigation>
      <div
        v-if="showSearch"
        class="bottom-nav-container"
      >
        <KButton
          primary
          :text="saveAndFinishAction$()"
          @click="closeSidePanel"
        />
      </div>
    </template>
  </SidePanelModal>

</template>


<script>

  import SidePanelModal from 'kolibri-common/components/SidePanelModal';
  import { coreStrings } from 'kolibri/uiText/commonCoreStrings';
  import { ref } from 'vue';
  import ContentNodeResource from 'kolibri-common/apiResources/ContentNodeResource';
  import ChannelResource from 'kolibri-common/apiResources/ChannelResource';
  import AccessibleChannelCard from 'kolibri-common/components/Cards/AccessibleChannelCard.vue';
  import SearchFiltersPanel from 'kolibri-common/components/SearchFiltersPanel/index.vue';
  import useBaseSearch from 'kolibri-common/composables/useBaseSearch';

  export default {
    name: 'LessonResourceSelection',
    components: {
      SidePanelModal,
      AccessibleChannelCard,
      SearchFiltersPanel,
    },
    setup() {
      const loading = ref(false);
      const bookmarks = ref([]);
      const channels = ref([]);
      const showSearch = ref(true);
      const topic = ref(null);

      const { searchTerms } = useBaseSearch(topic);

      const loadBookmarks = async () => {
        const data = await ContentNodeResource.fetchBookmarks({
          params: { limit: 25, available: true },
        });

        bookmarks.value = data.results || [];
      };

      const loadChannels = async () => {
        const response = await ChannelResource.fetchCollection({
          getParams: {
            available: true,
          },
        });
        channels.value = response;
      };

      const loadData = async () => {
        loading.value = true;
        await Promise.all([loadBookmarks(), loadChannels()]);
        loading.value = false;
      };

      loadData();

      const {
        selectFromChannels$,
        numberOfBookmarks$,
        bookmarksLabel$,
        selectFromBookmarks$,
        searchLabel$,
        saveAndFinishAction$,
      } = coreStrings;

      return {
        loading,
        bookmarks,
        channels,
        showSearch,
        searchTerms,
        selectFromChannels$,
        numberOfBookmarks$,
        bookmarksLabel$,
        selectFromBookmarks$,
        searchLabel$,
        saveAndFinishAction$,
      };
    },
    methods: {
      closeSidePanel() {
        this.$router.go(-1);
      },
    },
    $trs: {
      manageLessonResourcesTitle: {
        message: 'Manage lesson resources',
        context:
          "In the 'Manage lesson resources' coaches can add new/remove resource material to a lesson.",
      },
    },
  };

</script>


<style scoped>

  .side-panel-title {
    margin-top: 20px;
    font-size: 18px;
  }

  .side-panel-subtitle {
    font-size: 16px;
  }

  .channels-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;
    margin-bottom: 16px;
  }

  .bottom-nav-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }

  .back-button-class {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 6.5rem;
  }

  .back-button-style {
    position: relative;
    top: 3.8px;
  }

</style>
