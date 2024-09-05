export interface User {
    [key: string]: any;
    id: string,
    player_id: string,
    picture: string,
    name: string,
    position: string,
    year_joined: number,
    games_played: number,
};

export interface League {
    [key: string]: any;
    id: string,
    player_id: string,
    picture: string,
    name: string,
    position: string,
    year_joined: number,
    games_played: number,
};

export interface Team {
    [key: string]: any; 
    id: string,
    name: string,
    captain: string,
    logo: string,
    roster: Player[],
    goalie: Player,
    games_played: number,
    wins: number,
    losses: number,
    ties: number,
    points: number,
    goals_for: number,
    goals_against: number,
    differential: number,
    shots: number,
    season: number,
};

export interface Player {
    [key: string]: any; 
    id: string,
    name: string,
    captain: string,
    logo: string,
    roster: Player[],
    goalie: Player,
    games_played: number,
    wins: number,
    losses: number,
    ties: number,
    points: number,
    goals_for: number,
    goals_against: number,
    differential: number,
    shots: number,
    season: number,
};

export interface Contract {
    game_id: string,
    status: string, 
    formatted_date: string,
    time: string,
    season: number,
    home_team: string,
    home_team_logo: string,
    home_team_id: string,
    away_team: string,
    away_team_logo: string,
    away_team_id: string,
    home_score: number,
    home_shots: number,
    away_score: number,
    away_shots: number,
    hasBoxscore: boolean,
};