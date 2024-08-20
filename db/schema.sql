DROP TABLE IF EXISTS states;
CREATE TABLE states
(
    state_id CHAR(2) PRIMARY KEY,
    state VARCHAR(25)
);

DROP TABLE IF EXISTS temperatures;
CREATE TABLE temperatures
(
    month INT,
    year INT,
    average_temp FLOAT,
    state_id CHAR(2),
    FOREIGN KEY (state_id) REFERENCES states(state_id)
);