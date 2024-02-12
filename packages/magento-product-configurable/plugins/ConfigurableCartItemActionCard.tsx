import type { CartItemActionCard } from '@graphcommerce/magento-cart-items'
import type { PluginProps } from '@graphcommerce/next-config'
import { isTypename } from '@graphcommerce/next-ui'
import { ConfigurableCartItemOptions } from '../components'

export const component = 'CartItemActionCard'
export const exported =
  '@graphcommerce/magento-cart-items/components/CartItemActionCard/CartItemActionCard'

export function ConfigurableCartItemActionCard(
  props: PluginProps<React.ComponentProps<typeof CartItemActionCard>>,
) {
  const { Prev, ...rest } = props

  if (!isTypename(rest.cartItem, ['ConfigurableCartItem'])) return <Prev {...rest} />

  return (
    <Prev
      {...rest}
      cartItem={{
        ...rest.cartItem,
        product: {
          ...rest.cartItem.product,
          name: import.meta.graphCommerce.configurableVariantValues?.content
            ? rest.cartItem.configured_variant.name
            : rest.cartItem.product.name,
          thumbnail: rest.cartItem.configured_variant.thumbnail,
          // url_key: import.meta.graphCommerce.configurableVariantValues?.url
          //   ? rest.cartItem.configured_variant.url_key
          //   : rest.cartItem.product.url_key,
        },
      }}
      details={
        <>
          {rest.details}
          <ConfigurableCartItemOptions {...rest.cartItem} />
        </>
      }
    />
  )
}

export const Plugin = ConfigurableCartItemActionCard
