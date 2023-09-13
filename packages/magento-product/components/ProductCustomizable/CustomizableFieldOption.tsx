import React from 'react'
import { AutocompleteElement } from '@graphcommerce/ecommerce-ui'
import { useFormAddProductsToCart } from '../AddProductsToCart'
import { OptionTypeRenderer } from './ProductCustomizable.tsx'

export const CustomizableFieldOption = React.memo<
  React.ComponentProps<OptionTypeRenderer['CustomizableFieldOption']>
>((props) => {
  const { uid, fieldValue, required, optionIndex, index, title, product_sku, phonecase } = props
  const maxLength = fieldValue?.max_characters ?? undefined
  const { control, register } = useFormAddProductsToCart()
  const marca = phonecase?.map((a) => a?.brand) || []
  const modelo = ['S5', 'Iphone 12']
  const options = title === 'Marca' ? marca : modelo
  /*autocompleteProps?: Omit<
  AutocompleteProps<T, M, D, any>,
  'name' | 'options' | 'loading' | 'renderInput'
>*/
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
