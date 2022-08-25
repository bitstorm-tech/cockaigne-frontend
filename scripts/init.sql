CREATE TABLE IF NOT EXISTS account
(
    id           integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email        text      NOT NULL,
    "password"   text      NOT NULL,
    dealer       bool      NOT NULL DEFAULT false,
    street       text      NULL,
    company_name text      NULL,
    house_number text      NULL,
    city         text      NULL,
    zip          integer   NULL,
    phone        text      NULL,
    created      timestamp NULL,
    last_login   timestamp NULL,
    "location"   geometry  NULL
);

CREATE TABLE deal
(
    id          bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    account_id  integer   NOT NULL REFERENCES account (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    title       text      NOT NULL,
    description text      NOT NULL,
    "category"  text      NOT NULL,
    "duration"  integer   NOT NULL,
    "start"     timestamp NOT NULL,
    "template"  bool      NOT NULL DEFAULT false,
    created     timestamp NULL     DEFAULT now()
);

CREATE TABLE favorite_deal
(
    account_id integer NOT NULL REFERENCES account (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    deal_id    integer NOT NULL REFERENCES deal (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "favorite_deal_pkey" UNIQUE (account_id, deal_id)
);

CREATE TABLE favorite_dealer
(
    account_id integer NOT NULL REFERENCES account (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    dealer_id  integer NOT NULL REFERENCES deal (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "favorite_dealer_pkey" UNIQUE (account_id, dealer_id)
);

CREATE TABLE "like"
(
    account_id integer NOT NULL REFERENCES account (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    deal_id    integer NOT NULL REFERENCES deal (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "like_pkey" UNIQUE (account_id, deal_id)
);
