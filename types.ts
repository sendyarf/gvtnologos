export interface Server {
  url: string;
  label: string;
}

export interface Match {
  id: string;
  league: string;
  team1: {
    name: string;
  };
  team2: {
    name: string;
  };
  kickoff_date: string;
  kickoff_time: string;
  match_date: string;
  match_time: string;
  duration: string;
  servers: Server[];
}
