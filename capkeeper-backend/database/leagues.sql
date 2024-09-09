CREATE TABLE leagues (
	league_id VARCHAR(10) PRIMARY KEY,
    league_name VARCHAR(30),
    picture VARCHAR(255),
	num_teams INTEGER(2),
    salary_cap INTEGER(9),
    max_roster_size INTEGER(2),
    rookie_bank_size INTEGER(2),
    min_forwards INTEGER(2),
    min_defense INTEGER(2),
    min_goalies INTEGER(2),
    commissioner_id VARCHAR(30) REFERENCES users(user_name)
);

INSERT INTO leagues (league_id, league_name, num_teams, salary_cap, max_roster_size, rookie_bank_size, min_forwards, min_defense, min_goalies, commissioner_id) VALUES 
('100', 'Keeper League', 12, 80000000, 30, 10, 9, 5, 2, 'c_hand')
