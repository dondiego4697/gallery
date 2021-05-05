export enum DbTable {
    PROFESSION = 'profession',
    AUTHOR = 'author',
    AUTHOR_PROFESSION = 'author_profession',
    GALLERY = 'gallery',
    AUTHOR_GALLERY = 'author_gallery',
    PRODUCT_CATEGORY = 'product_category',
    PRODUCT_STYLE = 'product_style',
    PRODUCT_MATERIAL = 'product_material',
    PRODUCT_VIEW = 'product_view',
    PRODUCT = 'product',
    PRODUCT_PHOTO = 'product_photo',
    INTERIOR = 'interior',
    SELECTION = 'selection',
    PRODUCT_SELECTION = 'product_selection',
    USER = 'users',
    PRODUCT_LIKE = 'product_like',
    COLOR = 'color',
    PRODUCT_COLOR = 'product_color',
    TAG = 'tag',
    PRODUCT_TAG = 'product_tag'
}

export enum DbView {
    PRODUCT_VIEW = 'view__product_view',
    PRODUCT_LIKE = 'view__product_like',
    PRODUCT_MIN_MAX = 'view__product_min_max',
    PRODUCT_FILTERS = 'view__product_filters',
    PRODUCT_SEARCH = 'view__product_search'
}
