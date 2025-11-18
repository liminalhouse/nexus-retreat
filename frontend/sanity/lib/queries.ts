import {defineQuery} from 'next-sanity'

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  title,
  description,
  ogImage,
  navLinks[]{
    label,
    href,
    highlighted
  },
  footerTagline,
  footerEmail,
  footerQuickLinks[]{
    label,
    href
  },
  footerCopyright
}`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && (
    (defined($slug) && slug.current == $slug) ||
    (!defined($slug) && !defined(slug.current))
  )][0]{
    _id,
    _type,
    name,
    slug,
    bgColor,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "hero" => {
        description[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        },
        eventDate,
        eventLocation,
        ctaText,
        ctaLink,
        backgroundImage
      },
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
       _type == "faq" => {
        ...,
      }
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

export const registrationFormQuery = defineQuery(`
  *[_type == "registrationForm"][0]{
    _id,
    title,
    subtitle,
    eventDate,
    formBuilder {
      step1 {
        title,
        fieldGroups[] {
          groupTitle,
          groupDescription,
          fields[] {
            fieldType,
            label,
            name,
            placeholder,
            helperText,
            required,
            options[] {
              label,
              value
            },
            width
          }
        }
      },
      step2 {
        title,
        fieldGroups[] {
          groupTitle,
          groupDescription,
          fields[] {
            fieldType,
            label,
            name,
            placeholder,
            helperText,
            required,
            options[] {
              label,
              value
            },
            width
          }
        }
      },
      step3 {
        title,
        fieldGroups[] {
          groupTitle,
          groupDescription,
          fields[] {
            fieldType,
            label,
            name,
            placeholder,
            helperText,
            required,
            options[] {
              label,
              value
            },
            width
          }
        }
      }
    },
    submitButtonText,
    nextButtonText,
    backButtonText,
    backToHomeText,
    successMessage
  }
`)
