export enum RoutePaths {
    MORDA = '/',
    CATALOG = '/catalog',
    ARTISTS = '/artists',
    SELECTIONS = '/selections',
    ABOUT = '/about',
    CONTACTS = '/contacts',
    LIKE = '/like',
    CART = '/cart',
    PRODUCT = '/product/:code',
    ARTIST = '/artist/:code',
    SELECTION = '/selection/:code',
    PERSONAL_SELECTION = '/personal-selection'
}

export enum LoadableDataStatus {
    LOADING = 'LOADING',
    FAILED = 'FAILED',
    DONE = 'DONE'
}
