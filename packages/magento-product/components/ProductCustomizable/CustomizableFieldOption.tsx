import { TextFieldElement } from '@graphcommerce/ecommerce-ui'
import { SectionHeader } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Box } from '@mui/material'
import { useFormAddProductsToCart } from '../AddProductsToCart'
import { OptionTypeRenderer } from './CustomizableAreaOption'

type CustomizableFieldOptionProps = React.ComponentProps<
  OptionTypeRenderer['CustomizableFieldOption']
>

export function CustomizableFieldOption(props: CustomizableFieldOptionProps) {
  const { uid, required, optionIndex, index, title, fieldValue } = props
  const { control, register } = useFormAddProductsToCart()

  const maxLength = fieldValue?.max_characters ?? 0
  return (
    <Box>
      <SectionHeader labelLeft={title} sx={{ mt: 0 }} />
      <input
        type='hidden'
        {...register(`cartItems.${index}.entered_options.${optionIndex}.uid`)}
        value={uid}
      />
      <TextFieldElement
        sx={{ width: '100%' }}
        color='primary'
        multiline
        control={control}
        name={`cartItems.${index}.entered_options.${optionIndex}.value`}
        required={Boolean(required)}
        validation={{
          maxLength: {
            value: maxLength,
            message: i18n._(/* i18n*/ 'There is a maximum of ‘{maxLength}’ characters', {
              maxLength,
            }),
          },
        }}
        helperText={
          (maxLength ?? 0) > 0 &&
          i18n._(/* i18n*/ 'There is a maximum of ‘{maxLength}’ characters', {
            maxLength,
          })
        }
      />
    </Box>
  )
}
