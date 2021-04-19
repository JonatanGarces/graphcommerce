import { Container, NoSsr } from '@material-ui/core'
import { PageOptions } from '@reachdigital/framer-next-pages'
import {
  CountryRegionsDocument,
  CountryRegionsQuery,
} from '@reachdigital/magento-cart/countries/CountryRegions.gql'
import CreateCustomerAddressForm from '@reachdigital/magento-customer/CreateCustomerAddressForm'
import PageMeta from '@reachdigital/magento-store/PageMeta'
import { StoreConfigDocument } from '@reachdigital/magento-store/StoreConfig.gql'
import IconTitle from '@reachdigital/next-ui/IconTitle'
import { GetStaticProps } from '@reachdigital/next-ui/Page/types'
import SectionContainer from '@reachdigital/next-ui/SectionContainer'
import React from 'react'
import SheetLayout, { SheetLayoutProps } from '../../../components/AppShell/SheetLayout'
import apolloClient from '../../../lib/apolloClient'

type Props = CountryRegionsQuery
type GetPageStaticProps = GetStaticProps<Props>

function AddNewAddressPage(props: Props) {
  const { countries } = props

  return (
    <Container maxWidth='md'>
      <PageMeta title='Add address' metaDescription='Add new address' metaRobots={['noindex']} />
      <NoSsr>
        <IconTitle
          iconSrc='/icons/desktop_addresses.svg'
          title='Addresses'
          alt='addresses'
          size='large'
        />
        <SectionContainer label='Add new address'>
          <CreateCustomerAddressForm countries={countries} />
        </SectionContainer>
      </NoSsr>
    </Container>
  )
}

const pageOptions: PageOptions<SheetLayoutProps> = {
  overlayGroup: 'account',
  SharedComponent: SheetLayout,
  sharedKey: () => 'account-addresses',
  sharedProps: { variant: 'bottom', size: 'max' },
}
AddNewAddressPage.pageOptions = pageOptions

export default AddNewAddressPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = apolloClient(locale)
  const staticClient = apolloClient(locale)
  const conf = client.query({ query: StoreConfigDocument })

  const countryRegions = staticClient.query({
    query: CountryRegionsDocument,
  })

  return {
    props: {
      ...(await countryRegions).data,
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
