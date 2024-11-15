<script setup>
  const { data } = await useFetch('/api/artworks')
  const ogImage = computed(() => data.value[0]?.images.gallery)
  const description = "Artwork from famous historic artists."
  useSeoMeta({
    title: 'Gallery of Artworks',
    ogTitle: 'Gallery of Artworks',
    description: description,
    ogDescription: description,
    ogImage: ogImage,
  })
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
                <NuxtImg :src="artwork.images.thumbnail" width="310" class="relative z-0 w-full transition-all duration-500 scale-[120%] group-hover:scale-100" :alt="artwork.name" />
                <div class="absolute inset-0 transition-all duration-500 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <div class="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div class="absolute bottom-0 left-0 z-20 max-w-full p-4 lg:p-8 space-y-0.5 lg:space-y-2 text-left text-white">
                    <h2 class="font-bold lg:text-2xl">{{ artwork.name }}</h2>
                    <div class="flex items-center">
                      <p class="text-xs truncate transition-opacity duration-200 opacity-75 lg:text-sm group-hover:opacity-100">{{ artwork.artist.name }}</p>
                      <icon-right-arrow class="block w-6 h-6 duration-300 delay-500 -translate-x-full opacity-0 group-hover:translate-x-full group-hover:opacity-100" />
                    </div>
                  </div>
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
