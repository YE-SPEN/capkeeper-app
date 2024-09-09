CREATE TABLE teams (
	team_id VARCHAR(30),
	league_id VARCHAR(30) REFERENCES leagues(league_id),
	managed_by VARCHAR(50),
	team_name VARCHAR(30),
    picture VARCHAR(255),
    PRIMARY KEY (team_id, league_id)
);

INSERT INTO teams (team_id, league_id, managed_by, team_name, picture) VALUES 
('ostidepastrnak', '100', 'a_mic, s_mic', 'Osti de Pastrnak', 'https://bbhl-angular-bucket.nyc3.cdn.digitaloceanspaces.com/keeper_team_pics/osti-pastrnak.png'),
('chiefkeefe', '100', 'e_spen', 'Chief Keefe', 'https://bbhl-angular-bucket.nyc3.cdn.digitaloceanspaces.com/keeper_team_pics/cief_keefe.png'),
('nopointinwarmups', '100', 'j_heise, a_anag', 'No Point in Warmups', 'https://bbhl-angular-bucket.nyc3.cdn.digitaloceanspaces.com/keeper_team_pics/point_warmups.png'),
('garner-share', '100', 'j_share, j_garn', 'Garner/Share', ''),
('gaynessladder', '100', 'zik_jenn', 'Gayness Ladder', 'https://bbhl-angular-bucket.nyc3.cdn.digitaloceanspaces.com/keeper_team_pics/ladders.png'),
('thekeepers', '100', 'm_pose', 'The Keepers', 'https://bbhl-angular-bucket.nyc3.cdn.digitaloceanspaces.com/keeper_team_pics/keepers.png'),
('tkachukecheese', '100', 's_gourd, d_katz', 'Tkachuk E Cheese', 'https://bbhl-angular-bucket.nyc3.cdn.digitaloceanspaces.com/keeper_team_pics/tkachuk-e-cheese.png'),
('dovnesseverdeen', '100', 'dov_char', 'Dovness Everdeen', 'https://bbhl-angular-bucket.nyc3.cdn.digitaloceanspaces.com/keeper_team_pics/dovness.png'),
('themalakas', '100', 'c_hand, m_roum', 'The Malakas', 'https://bbhl-angular-bucket.nyc3.cdn.digitaloceanspaces.com/keeper_team_pics/malakas.png'),
('millzyhc', '100', 'z_miller', 'Millzy HC', 'https://bbhl-angular-bucket.nyc3.cdn.digitaloceanspaces.com/keeper_team_pics/millzy.png'),
('petterphiles', '100', 'aar_nurse', 'Petterphiles', 'https://bbhl-angular-bucket.nyc3.cdn.digitaloceanspaces.com/keeper_team_pics/petterphiles.png'),
('handfordwhalers', '100', 'r_hand', 'Handford Whalers', 'https://bbhl-angular-bucket.nyc3.cdn.digitaloceanspaces.com/keeper_team_pics/handford.png')
