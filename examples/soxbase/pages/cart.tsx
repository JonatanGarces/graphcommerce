import { useQuery } from '@apollo/client'
import { Container, NoSsr, Typography, makeStyles } from '@material-ui/core'
import PageLayout from '@reachdigital/magento-app-shell/PageLayout'
import { ClientCartDocument } from '@reachdigital/magento-cart/ClientCart.gql'
import CartItem from '@reachdigital/magento-cart/cart/CartItem'
import CartItems from '@reachdigital/magento-cart/cart/CartItems'
import CartQuickCheckout from '@reachdigital/magento-cart/cart/CartQuickCheckout'
import CartStartCheckout from '@reachdigital/magento-cart/cart/CartStartCheckout'
import CartTotals from '@reachdigital/magento-cart/cart/CartTotals'
import CheckoutStepper from '@reachdigital/magento-cart/cart/CheckoutStepper'
import EmptyCart from '@reachdigital/magento-cart/cart/EmptyCart'
import CouponAccordion from '@reachdigital/magento-cart/coupon/CouponAccordion'
import ConfigurableCartItem from '@reachdigital/magento-product-configurable/ConfigurableCartItem'
import PageMeta from '@reachdigital/magento-store/PageMeta'
import { StoreConfigDocument } from '@reachdigital/magento-store/StoreConfig.gql'
import AnimatedRow from '@reachdigital/next-ui/AnimatedRow'
import { GetStaticProps } from '@reachdigital/next-ui/Page/types'
import { registerRouteUi } from '@reachdigital/next-ui/PageTransition/historyHelpers'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import OverlayPage from '../components/AppShell/OverlayUi'
import apolloClient from '../lib/apolloClient'

type Props = Record<string, unknown>
type GetPageStaticProps = GetStaticProps<Props>

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    textAlign: 'center',
  },
}))

function CartPage() {
  const { data } = useQuery(ClientCartDocument)
  const hasItems = (data?.cart?.total_quantity ?? 0) > 0

  return (
    <OverlayPage
      title='Cart'
      variant='bottom'
      fullHeight
      backFallbackTitle='Home'
      backFallbackHref='/'
    >
      <PageMeta title='Cart' metaDescription='Cart Items' metaRobots={['noindex']} />
      <Container maxWidth='md'>
        <NoSsr>
          <Typography
            variant='h5'
            component='h1'
            style={{ textAlign: 'center', marginTop: '-30px' }}
          >
            Checkout
          </Typography>
          {hasItems ? (
            <AnimatePresence initial={false}>
              <CheckoutStepper steps={3} currentStep={1} key='checkout-stepper' />
              <AnimatedRow key='quick-checkout'>
                <CartQuickCheckout {...data?.cart?.prices?.grand_total} />
              </AnimatedRow>
              <CartItems
                id={data?.cart?.id ?? ''}
                items={data?.cart?.items}
                key='cart'
                renderer={{
                  BundleCartItem: CartItem,
                  ConfigurableCartItem,
                  DownloadableCartItem: CartItem,
                  SimpleCartItem: CartItem,
                  VirtualCartItem: CartItem,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore GiftCardProduct is only available in Commerce
                  GiftCardCartItem: CartItem,
                }}
              />
              <CouponAccordion key='couponform' />
              <CartTotals
                key='totals'
                prices={data?.cart?.prices}
                shipping_addresses={data?.cart?.shipping_addresses ?? []}
              />
              <AnimatedRow key='checkout-button'>
                <CartStartCheckout {...data?.cart?.prices?.grand_total} />
              </AnimatedRow>
            </AnimatePresence>
          ) : (
            <EmptyCart />
          )}
        </NoSsr>
      </Container>
    </OverlayPage>
  )
}

CartPage.Layout = PageLayout

registerRouteUi('/cart', OverlayPage)

export default CartPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = apolloClient(locale, true)
  const staticClient = apolloClient(locale)

  const config = client.query({ query: StoreConfigDocument })

  return {
    props: {
      apolloState: await config.then(() => client.cache.extract()),
    },
  }
}
