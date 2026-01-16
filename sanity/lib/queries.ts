import {defineQuery} from 'next-sanity'

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current
  }
`

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  registrationIsLive,
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
      },
      _type == "form" => {
        title,
        subtitle,
        description,
        numberOfSteps,
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
              }
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
              }
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
              }
            }
          }
        },
        submitButtonText,
        nextButtonText,
        backButtonText,
        successMessage,
        submitEndpoint
      }
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

export const sessionsQuery = defineQuery(`
  *[_type == "session"] | order(startTime asc) {
    _id,
    id,
    title,
    description,
    startTime,
    endTime,
    location,
    tags,
    photo,
    "speakers": speakers[]->{
      _id,
      id,
      firstName,
      lastName,
      title,
      profilePicture
    }
  }
`)

export const sessionByIdQuery = defineQuery(`
  *[_type == "session" && id.current == $id][0]{
    _id,
    id,
    title,
    description,
    startTime,
    endTime,
    location,
    tags,
    photo,
    "speakers": speakers[]->{
      _id,
      id,
      firstName,
      lastName,
      title,
      bio,
      profilePicture
    }
  }
`)

export const speakersQuery = defineQuery(`
  *[_type == "speaker"] | order(lastName asc) {
    _id,
    id,
    firstName,
    lastName,
    title,
    bio,
    profilePicture
  }
`)

export const speakerByIdQuery = defineQuery(`
  *[_type == "speaker" && id.current == $id][0]{
    _id,
    id,
    firstName,
    lastName,
    title,
    bio,
    profilePicture,
    "sessions": *[_type == "session" && references(^._id)] | order(startTime asc) {
      _id,
      id,
      title,
      startTime,
      endTime,
      location,
      tags,
      photo
    }
  }
`)

export const registrationFormContentQuery = defineQuery(`
  *[_type == "registrationForm" && _id == "registrationFormContent"][0]{
    title,
    subtitle,
    description,
    submitButtonText,
    nextButtonText,
    backButtonText,
    successMessage,
    step1Title,
    step2Title,
    step3Title,
    email,
    firstName,
    lastName,
    jobTitle,
    organization,
    mobilePhone,
    address,
    emergencyContact,
    assistant,
    guest,
    attendeeDetails,
    guestEventDetails
  }
`)
