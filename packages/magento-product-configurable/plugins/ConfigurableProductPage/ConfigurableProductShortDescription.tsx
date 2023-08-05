import type { AddToCartItemSelector, ProductShortDescription } from '@graphcommerce/magento-product'
import type { IfConfig, ReactPlugin } from '@graphcommerce/next-config'
import { useConfigurableSelectedVariant } from '../../hooks'

export const component = 'ProductShortDescription'
export const exported =
  '@graphcommerce/magento-product/components/ProductShortDescription/ProductShortDescription'
export const ifConfig: IfConfig = 'configurableVariantValues.content'

type PluginType = ReactPlugin<typeof ProductShortDescription, AddToCartItemSelector>

const ConfigurableProductShortDescription: PluginType = (props) => {
  const { Prev, product, ...rest } = props
  const variant = useConfigurableSelectedVariant({ url_key: product.url_key, index: 0 })

  return (
    <Prev
      product={{
        ...product,
        short_description: variant?.short_description?.html
          ? variant?.short_description
          : product.short_description,
      }}
      {...rest}
    />
  )
}

export const Plugin = ConfigurableProductShortDescription
