export interface User {
    [key: string]: any;
    user_name: string,
    first_name: string,
    last_name: string,
    picture: string,
    email: string,
    league_id: string,
    notification_count: number,
    team_managed: string,
    log_in_date: string,
    log_in_time: string,
    log_out_date: string,
    log_out_time: string
};

export interface League {
    [key: string]: any;
    league_id: string,
    league_name: string,
    picture: string,
    commissioner_id: string,
    commissioner: string,
    salary_cap: number,
    max_roster_size: number, 
    rookie_bank_size: number,
    min_forwards: number,
    min_defense: number,
    min_goalies: number,
    ir_slots: number,
    general_draft_length: number,
    rookie_draft_length: number,
};

export interface Team {
    [key: string]: any; 
    team_id: string,
    league_id: string,
    team_name: string,
    managed_by: string,
    picture: string,
    roster_size: number,
    total_cap: number,
    cap_space: number,
    roster: Player[],
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
    ir_count: number,
    rookie_bank: Player[],
    rookie_count: number,
    trade_block: Player[],
    draft_picks: Draft_Pick[],
    fa_picks: FA_Pick[],
    inbox: Trade[]
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
    onIR: boolean,
    onTradeBlock: boolean,
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

export interface Draft_Pick {
    [key: string]: any;
    asset_id: number,
    assigned_to: string,
    owned_by: string,
	league_id: number,
    year: number,
    round: number,
    position: number,
    pick_number: number,
    type: string,
    player_taken: string,
}

export interface FA_Pick {
    [key: string]: any;
    asset_id: number,
    assigned_to: string,
    owned_by: string,
	league_id: number,
    year: number,
    week: number,
    expiry_date: Date,
    player_taken: string,
}

export type Asset = (Player | Draft_Pick | FA_Pick) & {
  traded_to?: string | null; 
  asset_type?: 'player' | 'draft_pick' | 'fa';
  trade_id?: string | null;
} | null;

export interface Trade {
    [key: string]: any;
    trade_id: string,
    league_id: number,
    requested_by: string,
    sent_to: string,
    status: string,
    assets: Asset[]
}

export interface NHL_Team {
    [key: string]: any;
    short_code: string,
    city: string,
    team_name: string,
    logo: string,
}

export interface Activity {
    [key: string]: any;
    league_id: string,
    message: string,
    action_type: string,
    date: string,
    time: string,
    user_id: string,
    trade_id: string,
}