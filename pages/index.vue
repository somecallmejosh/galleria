<script setup>
const { data } = await useFetch('/api/artworks')
</script>

<template>
  <div class="pt-6 md:pt-0">
    <div class="relative page-wrapper">
      <div class="transition-all duration-500 page-wrapper">
        <div class="gap-4 columns-2 lg:columns-4 lg:gap-10">
          <template v-for="(artwork, index) in data" :key="artwork.id" >
            <div
              v-motion
              :initial="{ opacity: 0, y: 20}"
              :enter="{ opacity: 1, y: 0}"
              :delay="100 * index"
              class="mb-4 transition-all duration-300 opacity-0 lg:mb-10 hover:shadow-2xl">
              <NuxtLink :to="`/gallery/${artwork.id}`" class="relative block w-full overflow-hidden mix-blend-overlay group">
                <NuxtImg :src="artwork.images.thumbnail" width="310" class="relative z-0 w-full transition-all duration-500 group-hover:scale-110 group-hover:translate-y-4" :alt="artwork.name" />
                <div class="absolute inset-0 z-10 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:opacity-0"></div>
                <div class="absolute bottom-0 left-0 z-20 max-w-full p-6 lg:p-8 space-y-0.5 lg:space-y-2 text-left text-white">
                  <h2 class="font-bold lg:text-2xl">{{ artwork.name }}</h2>
                  <p class="text-xs truncate transition-opacity duration-200 opacity-75 lg:text-sm group-hover:opacity-100">{{ artwork.artist.name }}</p>
                </div>
              </NuxtLink>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .page-wrapper {
    @apply w-full max-w-[1360px] mx-auto px-2 lg:px-0
  }

  .progress-bar {
    @apply absolute top-0 left-0 h-0.5 bg-black;
    transition: width 0.1s linear;
  }
</style>
