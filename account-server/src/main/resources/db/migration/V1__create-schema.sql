CREATE TABLE account (
  account_id VARCHAR(36) NOT NULL,
  birth_day  DATE,
  member_id  VARCHAR(36) NOT NULL,
  PRIMARY KEY (account_id)
)
  ENGINE InnoDB;
CREATE TABLE account_addresses (
  account_id VARCHAR(36) NOT NULL,
  address_id VARCHAR(36) NOT NULL
)
  ENGINE InnoDB;
CREATE TABLE account_attribute (
  attribute_id    VARCHAR(36)  NOT NULL,
  attribute_name  VARCHAR(255) NOT NULL,
  attribute_value VARCHAR(255),
  PRIMARY KEY (attribute_id)
)
  ENGINE InnoDB;
CREATE TABLE account_attributes (
  account_id   VARCHAR(36) NOT NULL,
  attribute_id VARCHAR(36) NOT NULL
)
  ENGINE InnoDB;
CREATE TABLE account_emails (
  account_id VARCHAR(36) NOT NULL,
  email_id   VARCHAR(36) NOT NULL
)
  ENGINE InnoDB;
CREATE TABLE account_phones (
  account_id VARCHAR(36) NOT NULL,
  phone_id   VARCHAR(36) NOT NULL
)
  ENGINE InnoDB;
CREATE TABLE address (
  address_id VARCHAR(36)  NOT NULL,
  address    VARCHAR(255) NOT NULL,
  postcode   VARCHAR(128) NOT NULL,
  purpose    VARCHAR(128) NOT NULL,
  PRIMARY KEY (address_id)
)
  ENGINE InnoDB;
CREATE TABLE email (
  email_id      VARCHAR(36)  NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  purpose       VARCHAR(128) NOT NULL,
  PRIMARY KEY (email_id)
)
  ENGINE InnoDB;
CREATE TABLE phone (
  phone_id     VARCHAR(36)  NOT NULL,
  phone_number VARCHAR(128) NOT NULL,
  purpose      VARCHAR(128) NOT NULL,
  PRIMARY KEY (phone_id)
);
ALTER TABLE account
  ADD CONSTRAINT UK_6e0fggoup5ucnlg21hwxmbl36 UNIQUE (member_id);
ALTER TABLE account_addresses
  ADD CONSTRAINT UK_3p7u8ctv6aht0a2qonyu5w19y UNIQUE (address_id);
ALTER TABLE account_attributes
  ADD CONSTRAINT UK_g2gfp22jt4p02yq7bhwy2bbdc UNIQUE (attribute_id);
ALTER TABLE account_emails
  ADD CONSTRAINT UK_riyhrqt7tol86l3vblfi8dvox UNIQUE (email_id);
ALTER TABLE account_phones
  ADD CONSTRAINT UK_h6jieq8jp6f50m0xjyyenndoq UNIQUE (phone_id);
ALTER TABLE account_addresses
  ADD CONSTRAINT FKmm2mivkqmj2v3v202q1kqmq9t FOREIGN KEY (address_id) REFERENCES address (address_id);
ALTER TABLE account_addresses
  ADD CONSTRAINT FKk29q8n02ecu2edpjd40ge1xdy FOREIGN KEY (account_id) REFERENCES account (account_id);
ALTER TABLE account_attributes
  ADD CONSTRAINT FKnml634glxbr4bipin5odij2d9 FOREIGN KEY (attribute_id) REFERENCES account_attribute (attribute_id);
ALTER TABLE account_attributes
  ADD CONSTRAINT FK8upn61dmh2j8aigtvl9bk660y FOREIGN KEY (account_id) REFERENCES account (account_id);
ALTER TABLE account_emails
  ADD CONSTRAINT FK4hk6xatexrn25usqacy5w69ms FOREIGN KEY (email_id) REFERENCES email (email_id);
ALTER TABLE account_emails
  ADD CONSTRAINT FKndgrpna8udiqcdakne3ioencj FOREIGN KEY (account_id) REFERENCES account (account_id);
ALTER TABLE account_phones
  ADD CONSTRAINT FKm04wq5b7svb7tqi5walm8kjru FOREIGN KEY (phone_id) REFERENCES phone (phone_id);
ALTER TABLE account_phones
  ADD CONSTRAINT FKigmytavuhepru6pnhu2q3p6kq FOREIGN KEY (account_id) REFERENCES account (account_id);