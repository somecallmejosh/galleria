<script setup>
  const route = useRoute()

  const { data, status, error } = await useFetch('/api/artworks', {
    query: { id: route.params.id }
  })
</script>
<template>
  <div class="w-full max-w-[1360px] mx-auto">
    <h2>{{  data.name }}</h2>
    <p>{{  data.artist.name }}</p>
    <p>{{  data.year }}</p>
    <p>{{  data.description }}</p>
    <NuxtImg :src="data.images.gallery" width="310" class="w-full" :alt="data.name" />
  </div>
</template>
