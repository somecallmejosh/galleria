<script setup>
import { useSlideshowStore } from '~/store/slideshow'
const slideshowStore = useSlideshowStore()
const router = useRouter()
const startSlideshow = async () => {
  await slideshowStore.fetchArtworks()

  slideshowStore.startSlideShow()

  if (slideshowStore.activeSlide.id) {
    router.push({ name: 'gallery-id', params: { id: slideshowStore.activeSlide.id } })
  }
}

const stopSlideshow = () => {
  slideshowStore.stopSlideShow()
}

const routeHome = () => {
  slideshowStore.stopSlideShow()
  router.push({ name: 'index' })
}

watch(
  () => slideshowStore.activeSlide.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      router.push({ name: 'gallery-id', params: { id: newId } })
    }
  }
)
</script>
<template>
  <div class="font-body">
    <NuxtRouteAnnouncer />
    <div class="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-2xl">
      <div v-if="slideshowStore.slideShowActive" class="progress-bar lg:hidden" :style="{ width: `${slideshowStore.progress}%` }"></div>
      <header class="page-wrapper py-6 lg:py-10 border-b border-[#e5e5e5] md:mb-10 flex justify-between items-center">
        <NuxtLink @click="routeHome" to="/">
          <span class="sr-only">Return to home page</span>
          <Logo class="h-6 ml-2 md:h-12 md:ml-0" />
        </NuxtLink>
        <div class="pr-2 text-xs tracking-widest md:text-sm hover:opacity-50 md:pr-0">
          <button v-if="!slideshowStore.slideShowActive" class="flex items-center gap-1 uppercase" @click="startSlideshow" :disabled="slideshowStore.slideShowActive">
            <icon-movie class="w-6 h-6"/>
            Start Slideshow
          </button>
          <button v-else class="flex items-center gap-1 uppercase" @click="stopSlideshow" :disabled="!slideshowStore.slideShowActive">
            <icon-movie-off class="w-6 h-6"/>
            Stop Slideshow
          </button>
        </div>
      </header>
    </div>
    <NuxtPage />
  </div>
</template>
