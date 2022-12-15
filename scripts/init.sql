CREATE TABLE IF NOT EXISTS account
(
    id                   integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email                text                  NOT NULL,
    "password"           text                  NOT NULL,
    dealer               bool                  NOT NULL DEFAULT false,
    street               text                  NULL,
    username             text                  NULL,
    age                  integer               NULL,
    gender               text                  NULL,
    company_name         text                  NULL,
    default_category     integer               NULL REFERENCES category (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    house_number         text                  NULL,
    city                 text                  NULL,
    zip                  integer               NULL,
    phone                text                  NULL,
    tax_id               text                  NULL,
    last_login           timestamp             NULL,
    use_current_location bool                  NULL     DEFAULT false,
    search_radius        integer               NULL     DEFAULT 500,
    selected_categories  integer[]             NULL,
    "location"           geometry(point, 4326) NULL,
    created              timestamp             NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX account_username_idx ON account (LOWER(username));
CREATE UNIQUE INDEX account_company_name_idx ON account (LOWER(company_name));
CREATE UNIQUE INDEX account_email_idx ON account (LOWER(email));
CREATE INDEX account_location_idx ON account USING GIST (location);

CREATE TABLE category
(
    id   integer PRIMARY KEY,
    name text NOT NULL
);

INSERT INTO category (id, name)
VALUES (1, 'Elektronik & Technik'),
       (2, 'Unterhaltung & Gaming'),
       (3, 'Lebensmittel & Haushalt'),
       (4, 'Fashion, Schmuck & Lifestyle'),
       (5, 'Beauty, Wellness & Gesundheit'),
       (6, 'Family & Kids'),
       (7, 'Home & Living'),
       (8, 'Baumarkt & Garten'),
       (9, 'Auto, Fahhrad & Motorrad'),
       (10, 'Gastronomie, Bars & Cafes'),
       (11, 'Kultur & Freizeit'),
       (12, 'Sport & Outdoor'),
       (13, 'Reisen, Hotels & Übernachtungen'),
       (14, 'Dienstleistungen & Finanzen'),
       (15, 'Floristik'),
       (16, 'Sonstiges');

CREATE TABLE deal
(
    id          bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    dealer_id   integer   NOT NULL REFERENCES account (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    title       text      NOT NULL,
    description text      NOT NULL,
    category_id integer   NOT NULL REFERENCES category (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    "duration"  integer   NOT NULL,
    "start"     timestamp NOT NULL,
    "template"  bool      NOT NULL DEFAULT false,
    created     timestamp NOT NULL DEFAULT now()
);

CREATE TABLE dealer_rating
(
    user_id     integer   NOT NULL REFERENCES account (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    dealer_id   integer   NOT NULL REFERENCES account (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    stars       integer   NOT NULL,
    rating_text text      NULL,
    created     timestamp NOT NULL DEFAULT now(),
    CONSTRAINT "dealer_rating_pk" UNIQUE (user_id, dealer_id)
);

CREATE TABLE hot_deal
(
    user_id integer   NOT NULL REFERENCES account (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    deal_id integer   NOT NULL REFERENCES deal (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    created timestamp NOT NULL DEFAULT now(),
    CONSTRAINT "hot_deal_pk" UNIQUE (user_id, deal_id)
);

CREATE TABLE favorite_dealer
(
    user_id   integer   NOT NULL REFERENCES account (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    dealer_id integer   NOT NULL REFERENCES account (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    created   timestamp NOT NULL DEFAULT now(),
    CONSTRAINT "favorite_dealer_pk" UNIQUE (user_id, dealer_id)
);

CREATE TABLE "like"
(
    user_id integer   NOT NULL REFERENCES account (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    deal_id integer   NOT NULL REFERENCES deal (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    created timestamp NOT NULL DEFAULT now(),
    CONSTRAINT "like_pk" UNIQUE (user_id, deal_id)
);

CREATE VIEW like_count AS
SELECT deal_id, count(deal_id) AS likes
FROM "like"
GROUP BY deal_id
ORDER BY likes DESC;
