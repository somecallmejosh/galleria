import { defineStore } from 'pinia'

export const useSlideshowStore = defineStore('slideshow', () => {
  const artworks = ref([]) // Store all artworks
  const activeSlide = ref({})
  const slideShowActive = ref(false)
  const slideshowInterval = ref(null)
  const progress = ref(0)
  const progressInterval = ref(null)
  const slideDuration = 10000 // Duration for each slide in milliseconds

  // Fetch artworks data
  const fetchArtworks = async () => {
    const { data } = await useFetch('/api/artworks')
    artworks.value = data.value || []
  }

  // Set active slide by ID
  const setActiveSlide = (id) => {
    activeSlide.value = artworks.value.find(artwork => artwork.id === id) || {}
    resetProgress() // Reset progress whenever the active slide changes
  }

  // Check if there's an active slide
  const hasActiveSlide = computed(() => Object.keys(activeSlide.value).length > 0)

  // Computed properties for navigation
  const currentSlideIndex = computed(() =>
    artworks.value.findIndex(artwork => artwork.id === activeSlide.value.id)
  )
  const nextSlideIndex = computed(() => (currentSlideIndex.value + 1) % artworks.value.length)
  const previousSlideIndex = computed(() => (currentSlideIndex.value - 1 + artworks.value.length) % artworks.value.length)

  // Navigate to the next slide
  const nextSlide = () => {
    activeSlide.value = artworks.value[nextSlideIndex.value]
    resetProgress()
  }

  // Navigate to the previous slide
  const previousSlide = () => {
    activeSlide.value = artworks.value[previousSlideIndex.value]
    resetProgress()
  }

  // Start slideshow with progress indicator
  const startSlideShow = () => {
    if (!hasActiveSlide.value) {
      setActiveSlide(artworks.value[0].id) // Start with the first slide if no active slide
    }
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

  // Ensure intervals are cleared when component unmounts
  onBeforeUnmount(() => {
    stopSlideShow()
    stopProgress()
  })

  return {
    artworks,
    activeSlide,
    slideShowActive,
    progress,
    setActiveSlide,
    hasActiveSlide,
    currentSlideIndex,
    nextSlide,
    previousSlide,
    startSlideShow,
    stopSlideShow,
    fetchArtworks,
  }
})
