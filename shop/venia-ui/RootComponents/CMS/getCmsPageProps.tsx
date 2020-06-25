import apolloClient from 'node/apolloClient'
import { CmsPageDocument } from 'generated/apollo'
import { PromiseValue } from 'type-fest'
import getUrlResolveProps from 'shop/venia-ui/ShopLayout/getUrlResolveProps'

const getCmsPageProps = async (urlResolve: ReturnType<typeof getUrlResolveProps>) => {
  const client = await apolloClient()

  const cmsPage = client.query<GQLCmsPageQuery, GQLCmsPageQueryVariables>({
    query: CmsPageDocument,
    variables: { id: (await urlResolve).urlResolver.id },
  })
  return {
    ...(await cmsPage).data,
  }
}

export default getCmsPageProps

export type GetCmsPageProps = PromiseValue<ReturnType<typeof getCmsPageProps>>
