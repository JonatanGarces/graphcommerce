import { AutocompleteElement } from '@graphcommerce/ecommerce-ui'
import { filterNonNullableKeys, RenderType, TypeRenderer } from '@graphcommerce/next-ui'
import { AddToCartItemSelector, useFormAddProductsToCart } from '../AddProductsToCart'
import { ProductCustomizableFragment } from './ProductCustomizable.gql'
import { Autocomplete, TextField, AutocompleteProps } from '@mui/material'
import React, { useState } from 'react'

export type OptionTypeRenderer = TypeRenderer<
  NonNullable<NonNullable<ProductCustomizableFragment['options']>[number]> & {
    optionIndex: number
    index: number
  }
>
export const CustomizableFieldOption = React.memo<
  React.ComponentProps<OptionTypeRenderer['CustomizableFieldOption']>
>((props) => {
  const { uid, fieldValue, required, optionIndex, index, title, product_sku, phonecase } = props
  const maxLength = fieldValue?.max_characters ?? undefined
  const { control, register } = useFormAddProductsToCart()
  const marca = ['SAMSUNG', 'IPHONE']
  const modelo = ['S5', 'Iphone 12']
  const options = title === 'Marca' ? marca : modelo

  return (
    <>
      <input
        type='hidden'
        {...register(`cartItems.${index}.entered_options.${optionIndex}.uid`)}
        value={uid}
      />
      <AutocompleteElement
        name={`cartItems.${index}.entered_options.${optionIndex}.value`}
        control={control}
        required={Boolean(required)}
        label={title}
        multiple={false}
        defaultValue=''
        options={options}
        showCheckbox={Boolean(false)}
      />
    </>
  )
})

const defaultRenderer = {
  CustomizableAreaOption: () => <div>checkbox not implemented</div>,
  CustomizableCheckboxOption: () => <div>checkbox not implemented</div>,
  CustomizableDateOption: () => <div>date not implemented</div>,
  CustomizableDropDownOption: () => <div>checkbox not implemented</div>,
  CustomizableFieldOption,
  CustomizableFileOption: () => <div>file not implemented</div>,
  CustomizableMultipleOption: () => <div>multi not implemented</div>,
  CustomizableRadioOption: () => <div>radios not implemented</div>,
}

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] }

type MissingOptionTypeRenderer = Omit<OptionTypeRenderer, keyof typeof defaultRenderer>
type DefinedOptionTypeRenderer = Partial<Pick<OptionTypeRenderer, keyof typeof defaultRenderer>>

type OptionTypeRendererProp = Simplify<
  keyof MissingOptionTypeRenderer extends never
    ? (MissingOptionTypeRenderer & DefinedOptionTypeRenderer) | undefined
    : MissingOptionTypeRenderer & DefinedOptionTypeRenderer
>

type ProductCustomizableProps = AddToCartItemSelector & {
  product: ProductCustomizableFragment
} & (keyof MissingOptionTypeRenderer extends never
    ? { renderer?: OptionTypeRendererProp }
    : { renderer: OptionTypeRendererProp })

export function ProductCustomizable(props: ProductCustomizableProps) {
  const [state, setState] = useState({
    brand: '',
    model: '',
  })

  const { product, renderer, index = 0 } = props
  const { control, register } = useFormAddProductsToCart()
  const options = product?.options ?? []
  const indexBrand = 0
  const indexModel = 1
  const brandProps = {
    onChange: (e, value) => {
      setState({ ...state, brand: value, model: '' })
    },
    isOptionEqualToValue: (option, value) => option === value,
  }
  const modelProps = {
    isOptionEqualToValue: (option, value) => option === value,
  }
  return (
    <>
      <input
        type='hidden'
        {...register(
          `cartItems.${index}.entered_options.${(options[indexBrand]?.sort_order ?? 0) + 100}.uid`,
        )}
        value={options[indexBrand]?.uid ?? ''}
      />

      <AutocompleteElement
        name={`cartItems.${index}.entered_options.${
          (options[indexBrand]?.sort_order ?? 0) + 100
        }.value`}
        control={control}
        required={Boolean(options[indexBrand]?.required)}
        label={options[indexBrand]?.title ?? ''}
        multiple={false}
        options={[...new Set(product.phonecase?.map((a) => a?.brand))] || []}
        showCheckbox={Boolean(false)}
        autocompleteProps={brandProps}
      />

      <input
        type='hidden'
        {...register(
          `cartItems.${index}.entered_options.${(options[indexModel]?.sort_order ?? 0) + 100}.uid`,
        )}
        value={options[indexModel]?.uid ?? ''}
      />
      <AutocompleteElement
        name={`cartItems.${index}.entered_options.${
          (options[indexModel]?.sort_order ?? 0) + 100
        }.value`}
        control={control}
        required={Boolean(options[indexModel]?.required)}
        label={options[indexModel]?.title ?? ''}
        multiple={false}
        defaultValue=''
        value={state.model}
        options={
          [
            ...new Set(
              product.phonecase
                ?.filter((phonecase) => phonecase?.brand === state.brand)
                .map((a) => a?.model),
            ),
          ] || []
        }
        showCheckbox={Boolean(false)}
        autocompleteProps={modelProps}
      />
    </>
  )
}
