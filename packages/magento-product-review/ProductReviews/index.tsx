import { useQuery } from '@apollo/client'
import { Chip, makeStyles, Theme, Typography } from '@material-ui/core'
import Button from '@reachdigital/next-ui/Button'
import Pagination from '@reachdigital/next-ui/Pagination'
import StarRatingField from '@reachdigital/next-ui/StarRatingField'
import responsiveVal from '@reachdigital/next-ui/Styles/responsiveVal'
import SvgImage from '@reachdigital/next-ui/SvgImage'
import { iconStarYellow } from '@reachdigital/next-ui/icons'
import React, { useState } from 'react'
import { ProductReviewsFragment } from './ProductReviews.gql'
import { ProductReviewsPageDocument } from './ProductReviewsPage.gql'

const useStyles = makeStyles(
  (theme: Theme) => ({
    review: {
      display: 'grid',
      gap: theme.spacings.sm,
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: `${theme.spacings.md} 0`,
      ...theme.typography.body1,
    },
    title: {
      display: 'grid',
      gridAutoFlow: 'column',
      justifyContent: 'start',
      gap: theme.spacings.xs,
      alignItems: 'center',
    },
    icon: {
      height: '14px',
    },
    chipRoot: {
      boxShadow: theme.shadows[2],
    },
    label: {
      marginBottom: '-2px',
      ...theme.typography.subtitle2,
    },
    meta: {
      color: theme.palette.text.disabled,
      display: 'grid',
      gridAutoFlow: 'column',
      justifyContent: 'space-between',
    },
    nickname: {},
    date: {},
    reviewsBottomContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 32,
    },
    paginationRoot: {
      margin: 0,
    },
    paginationButton: {
      padding: 0,
      minWidth: 'unset',
      borderRadius: '100%',
      '& > .MuiButton-label': {
        padding: 0,
      },
    },
    ratingRow: {
      display: 'grid',
      gap: responsiveVal(32, 64),
      gridAutoFlow: 'column',
      color: theme.palette.text.disabled,
      ...theme.typography.body2,
      justifyContent: 'space-between',
    },
    rating: {
      display: 'flex',
      gap: responsiveVal(8, 16),
      alignItems: 'center',
    },
  }),
  { name: 'ProductReviews' },
)

export type ProductReviewsProps = ProductReviewsFragment

export default function ProductReviews(props: ProductReviewsProps) {
  const { reviews, url_key, sku } = props
  const classes = useStyles()
  const config = 'en_US'
  const locale = config.replace('_', '-')

  const [reviewPage, setPage] = useState<number>(1)

  const { data: otherReviewsPage, loading } = useQuery(ProductReviewsPageDocument, {
    skip: reviewPage === 1,
    variables: {
      urlKey: url_key ?? '',
      reviewPage,
    },
  })

  const myReviews = otherReviewsPage?.products?.items?.[0]?.reviews ?? reviews

  const { current_page, total_pages } = myReviews.page_info

  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })

  if (!reviews) {
    return null
  }

  return (
    <div>
      {!loading &&
        myReviews.items.map((review) => (
          <div key={review?.summary} className={classes.review}>
            <div className={classes.title}>
              <Chip
                label={`${Number(review?.average_rating) / 20}/5`}
                icon={<SvgImage src={iconStarYellow} size={10} alt='review' loading='lazy' />}
                color='default'
                variant='outlined'
                classes={{ root: classes.chipRoot, icon: classes.icon, label: classes.label }}
              />
              <Typography variant='h5'> {review?.summary}</Typography>
            </div>
            <Typography variant='body1'>{review?.text}</Typography>

            <div className={classes.ratingRow}>
              {review?.ratings_breakdown.map(
                (ratingBreakdown) =>
                  ratingBreakdown?.name !== 'Rating' && (
                    <div key={`rating-${ratingBreakdown?.value}`} className={classes.rating}>
                      <span>{ratingBreakdown?.name}</span>
                      <StarRatingField
                        readOnly
                        size='small'
                        defaultValue={Number(ratingBreakdown?.value ?? 0)}
                      />
                    </div>
                  ),
              )}
            </div>

            <div className={classes.meta}>
              <div className={classes.nickname}>Written by {review?.nickname}</div>
              <time className={classes.date} dateTime={review?.created_at}>
                {review?.created_at &&
                  formatter.format(new Date(review?.created_at.replace(/-/g, '/')))}
              </time>
            </div>
          </div>
        ))}
      <div className={classes.reviewsBottomContainer}>
        <Button
          variant='pill'
          color='primary'
          text='bold'
          size='large'
          href={`/account/reviews/add/${sku}`}
        >
          Write a review
        </Button>

        <Pagination
          count={total_pages ?? 1}
          page={current_page ?? 1}
          classes={{ root: classes.paginationRoot }}
          renderLink={(p: number, icon: React.ReactNode) => (
            <Button
              onClick={() => {
                setPage(p)
              }}
              className={classes.paginationButton}
            >
              {icon}
            </Button>
          )}
        />
      </div>
    </div>
  )
}
