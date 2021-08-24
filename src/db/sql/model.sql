CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  url VARCHAR,
  description VARCHAR,
  img VARCHAR
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  url VARCHAR,
  description TEXT
);

CREATE TABLE category_to_product (
  id SERIAL PRIMARY KEY,
  -- category_id INT,
  -- product_id INT,
  level INT
);

CREATE TABLE labels (
  id SERIAL PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE tag_to_product (
  id SERIAL PRIMARY KEY
  -- tag_id INT,
  -- product_id INT,
);

CREATE TABLE units (
  id SERIAL PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  -- categ_id INT,
  -- info_id INT,
  -- label_id INT,
  -- tag_id INT,
  -- property_id INT,
  -- units_id INT,
  -- supplier_id INT,
  productId VARCHAR,
  name VARCHAR,
  description TEXT,
  price VARCHAR,
  oldProce VARCHAR,
  amount INT,
  vendor VARCHAR
);

CREATE TABLE info (
  id SERIAL PRIMARY KEY,
  -- product_id INT,
  title VARCHAR,
  description TEXT
);

CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  -- product_id INT,
  size VARCHAR,
  color VARCHAR,
  type VARCHAR,
  rest1 VARCHAR,
  rest2 VARCHAR,
  rest3 VARCHAR
);


-- FK to category_to_product table
ALTER TABLE category_to_product 
  ADD COLUMN category_id INTEGER 
  REFERENCES categories(id);

ALTER TABLE category_to_product
  ADD COLUMN product_id INTEGER 
  REFERENCES product(id);

-- FK to tag_to_product table
ALTER TABLE tag_to_product
  ADD COLUMN tag_id INTEGER
  REFERENCES tags(id);

ALTER TABLE tag_to_product
  ADD COLUMN product_id INTEGER
  REFERENCES product(id);

-- FK product table
ALTER TABLE product
  ADD COLUMN categ_id INTEGER
  REFERENCES category_to_product(id);

ALTER TABLE product
  ADD COLUMN info_id INTEGER
  REFERENCES info(id);

ALTER TABLE product
  ADD COLUMN label_id INTEGER
  REFERENCES labels(id);

ALTER TABLE product
  ADD COLUMN tag_id INTEGER
  REFERENCES tag_to_product(id);

ALTER TABLE product
  ADD COLUMN property_id INTEGER
  REFERENCES properties(id);

ALTER TABLE product
  ADD COLUMN units_id INTEGER
  REFERENCES units(id);

ALTER TABLE product
  ADD COLUMN supplier_id INTEGER
  REFERENCES suppliers(id);

-- FK info table

ALTER TABLE info
  ADD COLUMN product_id INTEGER
  REFERENCES product(id);

-- FK properties table

ALTER TABLE properties
  ADD COLUMN product_id INTEGER
  REFERENCES product(id);