import { componentSlots } from '@graphcommerce/next-ui'
import { styled } from '@mui/material'
import { ComponentProps } from 'react'

// ---- Setup ----

// To be able to select children from the consuming side, we define the classes.
// Minimal utility to convert the classes to selectors. Hover over `selectors` to see what it means.
const { componentName, classes, selectors } = componentSlots('MyComponent', ['child'] as const)

// ---- Root component ----

// We're creating a new styled('div') component and apply our styles to it.
const Root = styled('div', {
  name: componentName,
  target: componentName, // Optional for Root, adds class name `MyComponent` to the div.
})(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
}))

// ---- Child component ----

const Child = styled('div', {
  name: componentName,
  target: classes.child, // Mandatory for children, adds a class name `MyComponent-child` so it can be styled from the outside.
})(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 100,
  height: 100,
}))

// ---- MyComponent component ----

// Props of the component we are writing
export type MyComponentProps = Pick<ComponentProps<typeof Root>, 'sx' | 'children'>

export function MyComponent(props: MyComponentProps) {
  const { sx, children } = props
  return (
    <Root as='span' sx={sx}>
      My Component
      <Child>{children}</Child>
    </Root>
  )
}
MyComponent.selectors = selectors
