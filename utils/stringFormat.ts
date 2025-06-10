export const stripHtmlTags = (htmlString) => {
    return htmlString.replace(/<[^>]*>/g, '')
}
