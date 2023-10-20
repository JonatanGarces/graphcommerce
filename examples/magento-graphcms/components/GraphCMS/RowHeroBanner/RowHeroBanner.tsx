import { RichText } from '@graphcommerce/graphcms-ui'
import { breakpointVal, HeroBanner } from '@graphcommerce/next-ui'
import { Button } from '@mui/material'
import { RowHeroBannerFragment } from './RowHeroBanner.gql'

export function RowHeroBanner(props: RowHeroBannerFragment) {
  const { copy, heroAsset, pageLinks } = props

  return (
    <HeroBanner
      pageLinks={pageLinks.map(({ url, title }) => (
        <Button key={url} href={url} variant='outlined' size='large' sx={() => ({
          color: 'background.paper',
        })}>
          {title}
        </Button>
      ))}
      videoSrc={heroAsset.url}
      sx={(theme) => ({
        '& .HeroBanner-copy': {
          minHeight: { xs: 'min(70vh,600px)', md: 'min(70vh,1080px)' },
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacings.xl,
            justifyItems: 'start',
            alignContent: 'center',
            textAlign: 'left',
            width: '50%',
          },
        },
        color: 'background.paper',
      })}
    >
      <RichText
        {...copy}
        sxRenderer={{
          paragraph: {
            typography: 'overline',
            color: 'background.paper',
          },
          'heading-one': (theme) => ({
            textTransform: 'uppercase',
            mt: 1,
            mb: theme.spacings.sm,
            ...breakpointVal('fontSize', 36, 82, theme.breakpoints.values),
            '& strong': {
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: `1.2px #fff`,
            },
            color: 'background.paper',
          }),
          'heading-five': () => ({
            color: 'background.paper',
          }),
        }}
      />
    </HeroBanner>
  )
}
