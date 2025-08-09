const slugify = (str: string, demarcator?: string) => {
    if (!str) return ''

    const defaultDemarcator = '-'

    return str
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, demarcator ?? defaultDemarcator)
        .replace(/^-+|-+$/g, '')
}

export default slugify
