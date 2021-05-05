CREATE VIEW view__product_search AS (
    SELECT
        row_number() OVER (ORDER BY views DESC, likes DESC, created_at DESC) AS row_number,
        product_id,
        created_at,
        views,
        likes,
        style_code,
        material_code,
        shape_format_code,
        color_codes
    FROM (
        SELECT
            product.id AS product_id,
            coalesce(views.count, 0) AS views,
            coalesce(likes.count, 0) AS likes,
            product.created_at AS created_at,
            style.code AS style_code,
            material.code AS material_code,
            shape_format.code AS shape_format_code,
            jsonb_agg(color.code) AS color_codes
        FROM
            product
            INNER JOIN category ON category.id = product.category_id
            LEFT JOIN view__product_view views ON views.product_id = product.id
            LEFT JOIN view__product_like likes ON likes.product_id = product.id
            LEFT JOIN style ON product.style_id = style.id
            LEFT JOIN material ON product.material_id = material.id
            LEFT JOIN shape_format ON shape_format.id = product.shape_format_id
            LEFT JOIN product_color ON product_color.product_id = product.id
            LEFT JOIN color ON product_color.color_id = color.id
        WHERE
            product.is_sold IS FALSE
        GROUP BY (product.id, views.count, likes.count, style.id, material.id, shape_format.id, product_color.product_id)
    ) AS _temp
);

