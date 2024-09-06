const contentURL = (type, locale) => {
    switch(type) {
    case 'brands' :
        return `["/content/insight-web/${locale}/shop"]`
    case 'articles' :
        return `["/content/insight-web/${locale}/content-and-resources"]`
    case 'solutions' :
        return `["/content/insight-web/${locale}/what-we-do"]`
    }
}
export default contentURL
