import { adaptSearchParams } from '../search-params-adapter'

test('Adapt basic SearchContext ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    paginationTotalHits: 20,
  })
  expect(searchParams.attributesToHighlight).toContain('*')
  expect(searchParams.attributesToHighlight?.length).toBe(1)
})

test('Adapt SearchContext with filters, sort and no geo rules ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    paginationTotalHits: 20,
    facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
    sort: 'id < 1',
  })

  expect(searchParams.filter).toStrictEqual([
    ['genres="Drama"', 'genres="Thriller"'],
    ['title="Ariel"'],
  ])
  expect(searchParams.sort).toStrictEqual(['id < 1'])
  expect(searchParams.attributesToHighlight).toContain('*')
  expect(searchParams.attributesToHighlight?.length).toBe(1)
})

test('Adapt SearchContext with filters, sort and geo rules ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    paginationTotalHits: 20,
    facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
    insideBoundingBox: '0,0,0,0',
    sort: 'id < 1',
  })

  expect(searchParams.filter).toStrictEqual([
    '_geoRadius(0, 0, 0)',
    ['genres="Drama"', 'genres="Thriller"'],
    ['title="Ariel"'],
  ])
  expect(searchParams.sort).toStrictEqual(['_geoPoint(0, 0):asc', 'id < 1'])
  expect(searchParams.attributesToHighlight).toContain('*')
  expect(searchParams.attributesToHighlight?.length).toBe(1)
})

test('Adapt SearchContext with only facetFilters and geo rules ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    paginationTotalHits: 20,
    facetFilters: [['genres:Drama', 'genres:Thriller'], ['title:Ariel']],
    insideBoundingBox: '0,0,0,0',
  })

  expect(searchParams.filter).toEqual([
    '_geoRadius(0, 0, 0)',
    ['genres="Drama"', 'genres="Thriller"'],
    ['title="Ariel"'],
  ])
  expect(searchParams.attributesToHighlight).toContain('*')
  expect(searchParams.attributesToHighlight?.length).toBe(1)
})

test('Adapt SearchContext with only sort and geo rules ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    paginationTotalHits: 20,
    insideBoundingBox: '0,0,0,0',
    sort: 'id < 1',
  })

  expect(searchParams.filter).toEqual(['_geoRadius(0, 0, 0)'])
  expect(searchParams.sort).toStrictEqual(['_geoPoint(0, 0):asc', 'id < 1'])
  expect(searchParams.attributesToHighlight).toContain('*')
  expect(searchParams.attributesToHighlight?.length).toBe(1)
})

test('Adapt SearchContext with no sort abd no filters and geo rules ', () => {
  const searchParams = adaptSearchParams({
    indexUid: 'test',
    paginationTotalHits: 20,
    insideBoundingBox: '0,0,0,0',
  })

  expect(searchParams.filter).toEqual(['_geoRadius(0, 0, 0)'])
  expect(searchParams.sort).toStrictEqual(['_geoPoint(0, 0):asc'])
  expect(searchParams.attributesToHighlight).toContain('*')
  expect(searchParams.attributesToHighlight?.length).toBe(1)
})
