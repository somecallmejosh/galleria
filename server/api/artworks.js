// ~/server/api/artworks.js
import artworks from '~/server/data/artworks.json'

export default defineEventHandler((event) => {
  const query = getQuery(event)

  // If an ID is provided, return the specific artwork with that ID
  if (query?.id) {
    const filteredArtworks = artworks.filter(artwork => artwork.id === query.id)
    return filteredArtworks.length > 0 ? filteredArtworks[0] : { error: 'Artwork not found' }
  }

  // If no query is provided, return all artworks
  return artworks
})
