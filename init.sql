CREATE TABLE periods(
  id UUID PRIMARY KEY,
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  name VARCHAR(64) NOT NULL,
);

CREATE TABLE expenses(
  id UUID PRIMARY KEY,
  period UUID NOT NULL,
  zloty INTEGER NOT NULL,
  groszy INTEGER NOT NULL,
  category VARCHAR(64) NOT NULL,
  label VARCHAR(64) DEFAULT NULL,
  spent_on DATE NOT NULL,
  saved_on DATE NOT NULL,
  CONSTRAINT expenses_period_fkey FOREIGN KEY (period)
    REFERENCES periods (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
);
