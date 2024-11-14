<script setup>
  import { useSlideshowStore } from '~/store/slideshow'
  const route = useRoute()
  const router = useRouter()
  const store = useSlideshowStore()
  const { data, error } = await useFetch('/api/artworks', {
    query: { id: route.params.id }
  })

  if (!store.artworks.length) {
    await store.fetchArtworks()
  }

  store.setActiveSlide(route.params.id)

  const goToNextSlide = () => {
    store.nextSlide()
    router.push({ name: 'gallery-id', params: { id: store.activeSlide.id } })
  }

  const goToPreviousSlide = () => {
    store.previousSlide()
    router.push({ name: 'gallery-id', params: { id: store.activeSlide.id } })
  }

  watch(
    () => route.params.id,
    (newId) => {
      store.setActiveSlide(newId)
    }
  )

</script>
<template>
  <div class="w-full max-w-[1360px] mx-auto">
    <div class="space-y-24 bg-white">
      <div class="grid md:grid-cols-2 lg:grid-cols-3">
        <div class="relative z-0">
          <NuxtImg
            v-motion
            :initial="{ opacity: 0, x: 100, scaleX: 0.8}"
            :enter="{ opacity: 1, x: 0, scaleX: 1}"
            :duration="500"
            class="w-full opacity-0" :src="data.images.hero.large" :alt="data.name" />
        </div>
        <div class="relative z-10 md:flex md:flex-col md:justify-between">
          <div
            class="relative z-20 w-3/4 pt-6 pl-8 -translate-y-16 bg-white md:pb-6 md:translate-y-0 md:pt-0 md:pl-16 md:-translate-x-16 md:w-full">
            <h2
              v-motion
              :initial="{ opacity: 0, y: 20}"
              :enter="{ opacity: 1, y: 0}"
              :duration="1000"
              class="font-bold text-[29px] md:text-[56px] mb-3 md:max-w-[350px] leading-tight opacity-0">{{ data.name }}</h2>
            <p
              v-motion
              :initial="{ opacity: 0, y: 20}"
              :enter="{ opacity: 1, y: 0}"
              :duration="1000"
              class="text-[#7d7d7d] opacity-0">{{ data.artist.name }}</p>
          </div>
          <div class="pl-8 md:mt-auto">
            <NuxtImg
              v-motion
              :initial="{ opacity: 0, y: 100, scaleY: 0.5}"
              :enter="{ opacity: 1, y: 0, scaleY: 1}"
              :duration="200"
              class="opacity-0 md:translate-y-8 size-32" :src="data.artist.image" :alt="data.artist.name" />
          </div>
        </div>
        <div class="flex flex-col gap-8 px-4 md:px-0">
          <div class="relative flex-1">
            <h3
              v-motion
              :initial="{ opacity: 0, y: 100}"
              :enter="{ opacity: 1, y: 0}"
              :duration="1000"
              class="relative z-0 text-[100px] md:text-[200px] font-bold text-[#f3f3f3] text-right opacity-0">
              {{  data.year }}
            </h3>
            <p
              v-motion
              :initial="{ opacity: 0, y: 20}"
              :enter="{ opacity: 1, y: 0}"
              :duration="1000"
              class="text-sm text-[#7d7d7d] leading-loose md:max-w-[350px] -mt-10 md:-mt-24 relative z-20 opacity-0">{{ data.description }}</p>
          </div>
          <p><a :href="data.source" class="text-xs tracking-widest uppercase hover:underline" target="_blank" rel="nofollow">Go To Source</a></p>
        </div>
      </div>
      <div class="relative flex flex-wrap items-center justify-between gap-4 px-2 py-8 border-t md:px-0">
        <div v-if="store.slideShowActive" class="progress-bar" :style="{ width: `${store.progress}%` }"></div>
        <div class="">
          <p class="font-bold md:text-lg">{{  data.name }}</p>
          <p class="text-sm opacity-70">{{ data.artist.name }}</p>
        </div>
        <div class="flex items-center gap-10">
          <button @click="goToPreviousSlide">
            <div class="sr-only">Previous Slide</div>
            <IconPrevious class="size-4 md:size-8" />
          </button>
          <button @click="goToNextSlide">
            <div class="sr-only">Next Slide</div>
            <IconNext class="size-4 md:size-8" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
