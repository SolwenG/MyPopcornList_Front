import { anilistApi } from 'boot/axios'

const BASE_URL = 'https://graphql.anilist.co'

export const anilistService = {
    async search(query) {
        const response = await anilistApi.post(BASE_URL, {
            query: `
        query ($search: String) {
          Page(page: 1, perPage: 50) {
            media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
              id
              title {
                romaji
                english
                native
              }
              description
              coverImage {
                large
              }
              episodes
              duration
              status
              startDate {
                year
              }
              averageScore
              genres
            }
          }
        }
      `,
            variables: {
                search: query
            }
        })
        return response.data.data.Page.media
    },

    async getTopAnimes(page = 1) {
        const response = await anilistApi.post(BASE_URL, {
            query: `
        query ($page: Int) {
          Page(page: $page, perPage: 50) {
            media(type: ANIME, sort: SCORE_DESC) {
              id
              title {
                romaji
                english
                native
              }
              description
              coverImage {
                large
              }
              episodes
              duration
              status
              startDate {
                year
              }
              averageScore
              genres
            }
          }
        }
      `,
            variables: {
                page
            }
        })
        return response.data.data.Page.media
    },

    async getAnimeDetails(id) {
        const response = await anilistApi.post(BASE_URL, {
            query: `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            description
            coverImage {
              large
            }
            bannerImage
            episodes
            duration
            status
            startDate {
              year
              month
              day
            }
            averageScore
            genres
            characters {
              nodes {
                id
                name {
                  full
                }
                image {
                  large
                }
                description
                voiceActors(language: JAPANESE) {
                  id
                  name {
                    full
                  }
                  image {
                    large
                  }
                }
              }
            }
            staff {
              nodes {
                id
                name {
                  full
                }
                image {
                  large
                }
                primaryOccupations
              }
            }
            trailer {
              id
              site
              thumbnail
            }
            recommendations {
              nodes {
                mediaRecommendation {
                  id
                  title {
                    romaji
                  }
                  coverImage {
                    large
                  }
                }
              }
            }
          }
        }
      `,
            variables: {
                id
            }
        })
        return response.data.data.Media
    }
}
