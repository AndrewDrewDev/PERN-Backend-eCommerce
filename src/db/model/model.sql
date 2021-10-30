CREATE TABLE IF NOT EXISTS categories
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR UNIQUE NOT NULL,
    url         VARCHAR UNIQUE NOT NULL,
    description VARCHAR,
    img         VARCHAR,
    parent_id   INT REFERENCES categories (id),
    order_index INT
);

CREATE TABLE IF NOT EXISTS shop_config
(
    title                 VARCHAR,
    sub_title             VARCHAR,
    id                    VARCHAR,
    base_link             VARCHAR,
    address               VARCHAR,
    phone                 VARCHAR,
    email                 VARCHAR,
    pagination_number     VARCHAR,
    currency              VARCHAR,
    catalog_page          VARCHAR,
    category_number       VARCHAR,
    copyright             VARCHAR,
    social_network        VARCHAR,
    category_cloud_number VARCHAR,
    card_view             VARCHAR,
    site_grid_view        VARCHAR,
    site_detail_view      VARCHAR
);

CREATE TABLE IF NOT EXISTS tags
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR UNIQUE NOT NULL,
    url         VARCHAR UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS category_to_product
(
    id    SERIAL PRIMARY KEY,
    -- FK category_id INT,
    -- FK product_id INT,
    level INT
);

CREATE TABLE IF NOT EXISTS labels
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    url  VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tag_to_product
(
    id SERIAL PRIMARY KEY -- tag_id INT,
    -- FK product_id INT,
);

CREATE TABLE IF NOT EXISTS units
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR,
    url  VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    url  VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS statuses
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products
(
    id          SERIAL PRIMARY KEY,
    -- FK:
    -- info_id INT,
    -- label_id INT,
    -- tag_id INT,
    -- property_id INT,
    -- unit_id INT,
    -- supplier_id INT,
    -- vendor_id INT,
    -- status_id INT,
    product_id  VARCHAR,
    name        VARCHAR UNIQUE NOT NULL,
    description TEXT,
    price       VARCHAR,
    old_price   VARCHAR,
    amount      INT,
    vendor_id   VARCHAR
);

CREATE TABLE IF NOT EXISTS info
(
    id          SERIAL PRIMARY KEY,
    -- FK product_id INT,
    title       VARCHAR,
    description TEXT
);

CREATE TABLE IF NOT EXISTS properties
(
    id    SERIAL PRIMARY KEY,
    -- FK product_id INT,
    key   VARCHAR,
    value VARCHAR
);

CREATE TABLE IF NOT EXISTS product_images
(
    id      SERIAL PRIMARY KEY,
    -- FK product_id INT,
    name    VARCHAR UNIQUE NOT NULL,
    preview BOOLEAN
);

CREATE TABLE IF NOT EXISTS custom_categories
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR,
    url  VARCHAR
);

CREATE TABLE IF NOT EXISTS custom_categories_products
(
    id SERIAL PRIMARY KEY
    -- FK custom_categories_id INT,
    -- FK product_id INT,
);

CREATE TABLE IF NOT EXISTS info_pages
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR,
    url     VARCHAR,
    content TEXT
);

CREATE TABLE IF NOT EXISTS info_pages_images
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR
    -- FK info_page_id INT
);

CREATE TABLE IF NOT EXISTS slider
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR,
    img         VARCHAR,
    order_index INT
);

CREATE TABLE IF NOT EXISTS users
(
    id       SERIAL PRIMARY KEY,
    email    VARCHAR,
    password VARCHAR,
    role     VARCHAR
);

-- FK info_pages_images
ALTER TABLE
    info_pages_images
    ADD
        COLUMN IF NOT EXISTS info_page_id INTEGER REFERENCES info_pages (id);

-- FK to custom_categories
ALTER TABLE
    custom_categories_products
    ADD
        COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products (id);
ALTER TABLE
    custom_categories_products
    ADD
        COLUMN IF NOT EXISTS custom_categories_id INTEGER REFERENCES custom_categories (id);
-- FK to category_to_product table
ALTER TABLE
    category_to_product
    ADD
        COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories (id);
ALTER TABLE
    category_to_product
    ADD
        COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products (id);
-- FK to tag_to_product table
ALTER TABLE
    tag_to_product
    ADD
        COLUMN IF NOT EXISTS tag_id INTEGER REFERENCES tags (id);
ALTER TABLE
    tag_to_product
    ADD
        COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products (id);
-- FK product table
ALTER TABLE
    products
    ADD
        COLUMN IF NOT EXISTS info_id INTEGER REFERENCES info (id);
ALTER TABLE
    products
    ADD
        COLUMN IF NOT EXISTS label_id INTEGER REFERENCES labels (id);
ALTER TABLE
    products
    ADD
        COLUMN IF NOT EXISTS property_id INTEGER REFERENCES properties (id);
ALTER TABLE
    products
    ADD
        COLUMN IF NOT EXISTS unit_id INTEGER REFERENCES units (id);
ALTER TABLE
    products
    ADD
        COLUMN IF NOT EXISTS supplier_id INTEGER REFERENCES suppliers (id);
ALTER TABLE
    products
    ADD
        COLUMN IF NOT EXISTS status_id INTEGER REFERENCES statuses (id);
-- FK info table
ALTER TABLE
    info
    ADD
        COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products (id);
-- FK properties table
ALTER TABLE
    properties
    ADD
        COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products (id);
-- FK images table
ALTER TABLE
    product_images
    ADD
        COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products (id);
