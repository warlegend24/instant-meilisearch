import { searchClient, dataset, meilisearchClient } from './assets/utils'

describe('Instant Meilisearch Browser test', () => {
  beforeAll(async () => {
    const deleteTask = await meilisearchClient.deleteIndex('movies')
    await meilisearchClient.waitForTask(deleteTask.uid)
    await meilisearchClient
      .index('movies')
      .updateFilterableAttributes(['genres'])
    const documentsTask = await meilisearchClient
      .index('movies')
      .addDocuments(dataset)
    await meilisearchClient.index('movies').waitForTask(documentsTask.uid)
  })

  test('empty array on facetsDistribution', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          facets: [],
        },
      },
    ])

    expect(response.results[0].facets?.genres).toEqual(undefined)
  })

  test('one facet on facetsDistribution', async () => {
    const response = await searchClient.search([
      {
        indexName: 'movies',
        params: {
          query: '',
          facets: ['genres'],
        },
      },
    ])

    expect(response.results[0].facets?.genres?.Action).toEqual(3)
  })
})
