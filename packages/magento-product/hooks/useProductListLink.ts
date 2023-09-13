import {
  isFilterTypeEqual,
  isFilterTypeMatch,
  isFilterTypeRange,
  ProductListParams,
} from '../components/ProductListItems/filterTypes'

export function productListLink(props: ProductListParams): string {
  const { url, sort, currentPage, pageSize, filters: incoming } = props
  const isSearch = url.startsWith('search')
  const filters = isSearch ? incoming : { ...incoming, category_uid: undefined }
  const uid = incoming?.category_uid?.eq || incoming?.category_uid?.in?.[0]

  // base url path generation
  let paginateSort = ``
  let query = ``

  if (currentPage && currentPage > 1) paginateSort += `/page/${currentPage}`

  // todo(paales): How should the URL look like with multiple sorts?
  // Something like: /sort/position,price/dir/asc,asc
  const [sortBy] = Object.keys(sort)
  if (sort && sortBy) query += `/sort/${sortBy}`
  if (sort && sortBy && sort[sortBy] && sort[sortBy] === 'DESC') query += `/dir/desc`
  if (pageSize) query += `/page-size/${pageSize}`

  // Apply filters
  if (filters)
    Object.entries(filters).forEach(([param, value]) => {
      if (!value) return
      if (isFilterTypeEqual(value) && value.in?.length)
        query += `/${param}/${value.in.sort()?.join(',')}`
      if (isFilterTypeEqual(value) && value.eq) query += `/${param}/${value.eq}`
      if (isFilterTypeMatch(value)) paginateSort += `/${param}/${value.match}`
      if (isFilterTypeRange(value)) query += `/${param}/${value.from ?? '*'}-${value.to ?? '*'}`
    })

  // it's a category with filters, use the /c/ route.
  if (query && !isSearch)
    return `/c/${url}${paginateSort}/q${uid ? `/category_uid/${uid}` : ''}${query}`

  return query ? `/${url}${paginateSort}/q${query}` : `/${url}${paginateSort}`
}

export function useProductListLink(props: ProductListParams): string {
  return productListLink({ ...props, url: `${props.url}` })
}
