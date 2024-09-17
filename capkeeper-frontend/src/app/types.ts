export interface User {
    [key: string]: any;
    user_name: string,
    first_name: string,
    last_name: string,
    picture: string,
    email: string,
};

export interface League {
    [key: string]: any;
    league_id: string,
    league_name: string,
    picture: string,
    commissioner_id: string,
    salary_cap: number,
    max_roster_size: number, 
    rookie_bank_size: number,
    min_forwards: number,
    min_defense: number,
    min_goalies: number,
};

export interface Team {
    [key: string]: any; 
    team_id: string,
    team_name: string,
    managed_by: string,
    picture: string,
    roster_size: number,
    total_cap: number,
    cap_space: number,
    forwards: Player[],
    num_forwards: number,
    forward_salary: number,
    defense: Player[],
    num_defense: number,
    defense_salary: number,
    goalies: Player[],
    num_goalies: number,
    goalie_salary: number,
    injured_reserve: Player[],
    rookie_bank: Player[]
};

export interface Player {
    [key: string]: any; 
    player_id: string,
    first_name: string,
    last_name: string,
    short_code: string,
    logo: string,
    position: string,
    isRookie: boolean,
    contract_status: string,
    contract_end: string,
    expiry_status: string, 
    years_left_current: number,
    aav_current: number,
    years_left_next: number,
    aav_next: number,
    owned_by: string,
    last_updated: string,
    updated_by: string,
};

export interface NHL_Team {
    [key: string]: any;
    short_code: string,
    city: string,
    team_name: string,
    logo: string,
}