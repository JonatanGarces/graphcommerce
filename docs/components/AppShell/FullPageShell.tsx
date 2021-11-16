import {
  DesktopNavBar,
  FullPageShellBase,
  FullPageShellBaseProps,
  MenuFab,
  MenuProps,
} from '@graphcommerce/next-ui'
import { Container } from '@material-ui/core'
import React from 'react'
import Logo from './Logo'

export type FullPageShellProps = Omit<
  FullPageShellBaseProps,
  'menu' | 'logo' | 'actions' | 'classes' | 'name' | 'header' | 'footer'
> & {
  alwaysShowLogo?: boolean
}

function FullPageShell(props: FullPageShellProps) {
  const { children, alwaysShowLogo } = props

  const menuProps: MenuProps = {
    menu: [{ href: '/', children: `Documentation` }],
  }

  return (
    <FullPageShellBase
      name={'GraphCommerce'}
      alwaysShowHeader={alwaysShowLogo}
      header={
        <>
          <Logo alwaysShow={alwaysShowLogo} />
          <DesktopNavBar {...menuProps} />
          {/* <DesktopNavActions>
            {!router.pathname.startsWith('/search') && (
              <SearchButton onClick={onSearchStart} label=' ' />
            )}
            <PageLink href='/service' passHref>
              <Fab aria-label={t`Account`} size='large' color='inherit'>
                <SvgImageSimple src={iconCustomerService} size='large' />
              </Fab>
            </PageLink>
            <CustomerFab guestHref='/account/signin' authHref='/account' />

            <PlaceholderFab />
          </DesktopNavActions> */}
        </>
      }
      footer={<Container>&copy; GraphCommerce, by Reach Digital</Container>}
      menuFab={<MenuFab {...menuProps}></MenuFab>}
    >
      {children}
    </FullPageShellBase>
  )
}

export default FullPageShell
