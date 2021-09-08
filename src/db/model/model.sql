CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  url VARCHAR UNIQUE NOT NULL,
  description VARCHAR,
  img VARCHAR,
  parentId INT REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  url VARCHAR UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS category_to_product (
  id SERIAL PRIMARY KEY,
  -- category_id INT,
  -- product_id INT,
  level INT
);

CREATE TABLE IF NOT EXISTS labels (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  url VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tag_to_product (
  id SERIAL PRIMARY KEY
  -- tag_id INT,
  -- product_id INT,
);

CREATE TABLE IF NOT EXISTS units (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  url VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  url VARCHAR UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  -- info_id INT,
  -- label_id INT,
  -- tag_id INT,
  -- property_id INT,
  -- units_id INT,
  -- supplier_id INT,
  -- vendor_id INT,
  productId VARCHAR,
  name VARCHAR UNIQUE NOT NULL,
  description TEXT,
  price VARCHAR,
  oldPrice VARCHAR,
  amount INT,
  vendorId VARCHAR
);

CREATE TABLE IF NOT EXISTS info (
  id SERIAL PRIMARY KEY,
  -- product_id INT,
  title VARCHAR,
  description TEXT
);

CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  -- product_id INT,
  key VARCHAR,
  value VARCHAR
);


-- FK to category_to_product table
ALTER TABLE category_to_product
  ADD COLUMN IF NOT EXISTS category_id INTEGER
  REFERENCES categories(id);

ALTER TABLE category_to_product
  ADD COLUMN IF NOT EXISTS product_id INTEGER
  REFERENCES products(id);

-- FK to tag_to_product table
ALTER TABLE tag_to_product
  ADD COLUMN IF NOT EXISTS tag_id INTEGER
  REFERENCES tags(id);

ALTER TABLE tag_to_product
  ADD COLUMN IF NOT EXISTS product_id INTEGER
  REFERENCES products(id);

-- FK product table

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS info_id INTEGER
  REFERENCES info(id);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS label_id INTEGER
  REFERENCES labels(id);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS property_id INTEGER
  REFERENCES properties(id);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS units_id INTEGER
  REFERENCES units(id);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS supplier_id INTEGER
  REFERENCES suppliers(id);

-- FK info table

ALTER TABLE info
  ADD COLUMN IF NOT EXISTS product_id INTEGER
  REFERENCES products(id);

-- FK properties table

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS product_id INTEGER
  REFERENCES products(id);
