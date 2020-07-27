import React from 'react'
import { Typography, Container } from '@material-ui/core'

export default function CmsPageContent(props: GQLCmsPageContentFragment) {
  const { content_heading, content } = props
  return (
    <Container>
      {content_heading && (
        <Typography variant='h2' component='h1'>
          {content_heading}
        </Typography>
      )}
      {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
    </Container>
  )
}
