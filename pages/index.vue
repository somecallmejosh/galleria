<script setup>

const { data, status, error, refresh } = await useFetch('/api/artworks')
const activeSlide = ref({})
const slideShowActive = ref(false)
const slideshowInterval = ref(null)
const progress = ref(0) // Reference to track the progress of the slide
const progressInterval = ref(null) // Interval to update progress

const slideDuration = 20000 // Duration for each slide in milliseconds

// Set active slide by ID
const setActiveSlide = (id) => {
  activeSlide.value = data.value.find(artwork => artwork.id === id) || {}
  resetProgress() // Reset progress whenever the active slide changes
}

// Check if there's an active slide
const hasActiveSlide = computed(() => Object.keys(activeSlide.value).length > 0)

// Computed properties for navigation
const currentSlideIndex = computed(() => data.value.findIndex(artwork => artwork.id === activeSlide.value.id))
const nextSlideIndex = computed(() => (currentSlideIndex.value + 1) % data.value.length)
const previousSlideIndex = computed(() => (currentSlideIndex.value - 1 + data.value.length) % data.value.length)

// Navigate to the next slide
const nextSlide = () => {
  activeSlide.value = data.value[nextSlideIndex.value]
  resetProgress()
}

// Navigate to the previous slide
const previousSlide = () => {
  activeSlide.value = data.value[previousSlideIndex.value]
  resetProgress()
}

// Start slideshow with progress indicator
const startSlideShow = () => {
  setActiveSlide(data.value[0].id)  // Ensure the first slide is active
  slideshowInterval.value = setInterval(nextSlide, slideDuration)
  slideShowActive.value = true
  startProgress() // Start progress interval
}

// Stop slideshow and clear progress
const stopSlideShow = () => {
  clearInterval(slideshowInterval.value)
  slideshowInterval.value = null
  activeSlide.value = {}
  slideShowActive.value = false
  stopProgress() // Stop progress interval
}

// Toggle slideshow
const toggleSlideShow = () => {
  slideShowActive.value ? stopSlideShow() : startSlideShow()
}

// Progress management
const startProgress = () => {
  progress.value = 0
  progressInterval.value = setInterval(() => {
    progress.value += 100 / (slideDuration / 100) // Increment based on slide duration
    if (progress.value >= 100) progress.value = 100
  }, 100)
}

const resetProgress = () => {
  progress.value = 0
}

const stopProgress = () => {
  clearInterval(progressInterval.value)
  progress.value = 0
}

// Ensure interval is cleared when component unmounts
onBeforeUnmount(() => {
  stopSlideShow()
  stopProgress()
})
</script>

<template>
  <div>
    <div class="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-2xl">
      <header class="page-wrapper py-10 border-b border-[#e5e5e5] mb-10 flex justify-between items-center">
        <Logo class="h-12" />
        <button v-if="!slideShowActive" @click="startSlideShow" class="text-sm tracking-widest uppercase transition-opacity duration-200 hover:opacity-50">
          Start Slideshow
        </button>
        <button v-else @click="stopSlideShow">Stop Slideshow</button>
      </header>
    </div>
    <div class="relative page-wrapper">
      <div v-if="!hasActiveSlide" class="transition-all duration-500 page-wrapper">
        <ul class="gap-6 columns-2 lg:columns-4 lg:gap-10">
          <li v-for="artwork in data" :key="artwork.id" class="mb-6 transition-all duration-300 lg:mb-10 hover:shadow-2xl">
            <button @click="setActiveSlide(artwork.id)" class="relative block w-full overflow-hidden mix-blend-overlay group">
              <NuxtImg :src="artwork.images.thumbnail" width="310" class="relative z-0 w-full transition-all duration-500 group-hover:scale-110 group-hover:translate-y-4" :alt="artwork.name" />
              <div class="absolute inset-0 z-10 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:opacity-0"></div>
              <div class="absolute bottom-0 left-0 z-20 max-w-full p-8 space-y-2 text-left text-white">
                <h2 class="text-2xl font-bold">{{ artwork.name }}</h2>
                <p class="text-sm truncate transition-opacity duration-200 opacity-75 group-hover:opacity-100">{{ artwork.artist.name }}</p>
              </div>
            </button>
          </li>
        </ul>
      </div>
      <div class="space-y-24 bg-white" v-if="hasActiveSlide && activeSlide">
        <div class="grid grid-cols-3">
          <div>
            <NuxtImg :src="activeSlide.images.hero.large" :alt="activeSlide.name" />
          </div>
          <div class="flex flex-col justify-between">
            <div class="pb-6 pl-16 -translate-x-16 bg-white">
              <h2 class="font-bold text-[56px] mb-3 max-w-[350px] leading-tight">{{ activeSlide.name }}</h2>
              <p class="text-[#7d7d7d]">{{ activeSlide.artist.name }}</p>
            </div>
            <div class="pl-8 mt-auto">
              <NuxtImg class="translate-y-8 size-32" :src="activeSlide.artist.image" :alt="activeSlide.artist.name" />
            </div>
          </div>
          <div class="flex flex-col gap-8">
            <div class="flex-1">
              <h3 class="text-[200px] font-bold text-[#f3f3f3]">
                {{  activeSlide.year }}
              </h3>
              <p class="text-sm text-[#7d7d7d] leading-loose max-w-[350px] -mt-24">{{ activeSlide.description }}</p>
            </div>
            <p><a :href="activeSlide.source" class="text-xs tracking-widest uppercase hover:underline" target="_blank" rel="nofollow">Go To Source</a></p>
          </div>
        </div>
        <div class="relative flex items-center justify-between px-10 py-8 border-t">
          <div v-if="slideShowActive" class="progress-bar" :style="{ width: `${progress}%` }"></div>
          <div>
            <p class="text-lg font-bold">{{  activeSlide.name }}</p>
            <p>{{ activeSlide.artist.name }}</p>
          </div>
          <div class="flex items-center gap-10">
            <button @click="previousSlide">
              <div class="sr-only">Previous Slide</div>
              <IconPrevious class="size-8" />
            </button>
            <button @click="nextSlide">
              <div class="sr-only">Next Slide</div>
              <IconNext class="size-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .page-wrapper {
    @apply w-full max-w-[1360px] mx-auto px-6 lg:px-0
  }

  .progress-bar {
    @apply absolute top-0 left-0 h-0.5 bg-black;
    transition: width 0.1s linear;
  }
</style>
