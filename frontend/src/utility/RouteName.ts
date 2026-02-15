export const RouteIndex = '/'
export const RouteSignIn = '/sign-in'
export const RouteSignUp = '/sign-up'
export const RouteProfile = '/profile'
export const RouteCategoryDetails = '/categories'
export const RouteAddCategory = '/category/add'
export const RouteEditCategory = (category_id?: string | number) => {
    if (category_id) {
        return `/category/edit/${category_id}`
    } else {
        return `/category/edit/:category_id`
    }
}

export const RouteBlog = '/blog'
export const RouteBlogAdd = '/blog/add'
export const RouteBlogEdit = (blogid?: string | number) => {
    if (blogid) {
        return `/blog/edit/${blogid}`
    } else {
        return `/blog/edit/:blogid`
    }
}


export const RouteBlogDetails = (category?: string, blog?: string) => {
    if (!category || !blog) {
        return '/blog/:category/:blog'
    } else {
        return `/blog/${category}/${blog}`
    }
}


export const RouteBlogByCategory = (category?: string) => {
    if (!category) {
        return '/blog/:category'
    } else {
        return `/blog/${category}`
    }
}



export const RouteSearch = (q?: string) => {
    if (q) {
        return `/search?q=${q}`
    } else {
        return `/search`
    }
}


export const RouteCommentDetails = '/comments'
export const RouteUser = '/users'