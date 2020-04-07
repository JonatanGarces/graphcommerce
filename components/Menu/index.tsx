import React from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import MaterialMenu from '@material-ui/core/Menu'
import zIndex from '@material-ui/core/styles/zIndex'
import Router from 'next/router'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Fab from '@material-ui/core/Fab'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Theme } from '@material-ui/core'
import { GQLMenuFragment, GQLPageMetaFragment, GQLMetaRobots } from '../../generated/graphql'
import Link from '../Link'
import { vpCalc } from '../Theme'

type TreePage = GQLMenuFragment['pages'][0] & { children: TreePage[]; parent?: TreePage }
export type MenuProps = { mainMenu: GQLMenuFragment; page: GQLPageMetaFragment }

const extractRoots = (mainMenu: GQLMenuFragment) => {
  const treePages: TreePage[] = mainMenu.pages.map((p) => ({ ...p, children: [] }))
  treePages.forEach((p) => {
    const parentUrl = p.url.split('/').slice(0, -1).join('/')
    const parent = treePages.find((pp) => pp.url === parentUrl)
    p.parent = parent
    if (parent) parent.children.push(p)
  })
  const roots = treePages.filter((p) => !p.parent)
  return roots
}

const useStyles = makeStyles((theme: Theme) => ({
  menuOpen: {
    position: 'fixed',
    left: vpCalc(18, 60),
    top: vpCalc(18, 60),
    zIndex: zIndex.appBar,
  },
  menu: {
    backgroundColor: theme.palette.tertiary.main,
    color: theme.palette.tertiary.contrastText,
    minWidth: 200,
  },
  menuClose: {
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  menuLink: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
  menuItemText: {
    ...theme.typography.h3,
    fontWeight: 600,
  },
  menuItem: {
    '&:hover': {
      backgroundColor: theme.palette.tertiary.light,
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.tertiary.light,
    },
    '&.Mui-selected:hover': {
      backgroundColor: theme.palette.tertiary.light,
    },
  },
}))

const Menu: React.FC<MenuProps> = ({ mainMenu, page }) => {
  const classes = useStyles()
  const [openEl, setOpenEl] = React.useState<null | HTMLElement>(null)

  const roots = extractRoots(mainMenu)
  Router.events.on('routeChangeComplete', () => setOpenEl(null))

  return (
    <>
      <Fab
        color='primary'
        aria-label='add'
        size='medium'
        onClick={(event) => setOpenEl(event.currentTarget)}
        className={classes.menuOpen}
      >
        <MenuIcon htmlColor='#fff' fontSize='small' />
      </Fab>

      <MaterialMenu
        anchorEl={openEl}
        open={!!openEl}
        onClose={() => setOpenEl(null)}
        keepMounted
        getContentAnchorEl={null} // https://github.com/mui-org/material-ui/issues/7961#issuecomment-326116559
        anchorOrigin={{ horizontal: -16, vertical: -16 }}
        variant='menu'
        classes={{ paper: classes.menu }}
      >
        <Fab
          color='primary'
          aria-label='add'
          size='medium'
          onClick={() => setOpenEl(null)}
          classes={{ root: classes.menuClose }}
        >
          <CloseIcon htmlColor='#fff' fontSize='small' />
        </Fab>

        <Link
          href='/'
          metaRobots={GQLMetaRobots.IndexFollow}
          color='inherit'
          className={classes.menuLink}
        >
          <ListItem button selected={page.url === '/'} classes={{ root: classes.menuItem }}>
            <ListItemText classes={{ primary: classes.menuItemText }}>Home</ListItemText>
          </ListItem>
        </Link>
        {roots.map((root) => (
          <Link
            key={root.id}
            href={root.url}
            metaRobots={root.metaRobots!}
            color='inherit'
            className={classes.menuLink}
          >
            <ListItem
              button
              key={root.id}
              selected={page.url === root.url}
              classes={{ root: classes.menuItem }}
            >
              <ListItemText classes={{ primary: classes.menuItemText }}>{root.title}</ListItemText>
            </ListItem>
          </Link>
        ))}
      </MaterialMenu>
    </>
  )
}

export default Menu
