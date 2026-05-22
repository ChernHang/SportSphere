import { Match } from '../types';

export const mockMatches: Match[] = [
  {
    id: '1',
    teamA: 'Real Madrid',
    teamB: 'Man City',
    score: '2 - 1',
    tournament: 'Champions League',
    events: ["GOAL! Real Madrid 1-0 (24')", "GOAL! Man City 1-1 (48')", "GOAL! Real Madrid 2-1 (65')", "Substitution (72')"],
    startTime: 'LIVE',
    league: 'Group A',
    genre: 'football',
    date: '2026-05-22', // FRI
    region: 'Europe',
    logoA: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
    logoB: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
    banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Santiago_Bernab%C3%A9u_2014.jpg/800px-Santiago_Bernab%C3%A9u_2014.jpg'
  },
  {
    id: '2',
    teamA: 'Lakers',
    teamB: 'Celtics',
    score: 'VS',
    tournament: 'NBA Finals',
    events: [],
    startTime: '21:00',
    league: 'Finals',
    genre: 'basketball',
    date: '2026-05-22', // FRI
    region: 'USA',
    logoA: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg',
    logoB: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg',
    banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Staples_Center%2C_Los_Angeles%2C_CA_%28cropped%29.jpg/800px-Staples_Center%2C_Los_Angeles%2C_CA_%28cropped%29.jpg'
  },
  {
    id: '3',
    teamA: 'M. Verstappen',
    teamB: 'L. Hamilton',
    score: 'LAP 42/78',
    tournament: 'Monaco GP',
    events: ["Lap 1: Verstappen takes early lead", "Lap 15: Hamilton pits, switches to hard tires"],
    startTime: 'LIVE',
    league: 'Race Day',
    genre: 'f1',
    date: '2026-05-22', // FRI
    region: 'Global',
    isIndividual: true,
    logoA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Max_Verstappen_2017_Malaysia_3.jpg/800px-Max_Verstappen_2017_Malaysia_3.jpg',
    logoB: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg/800px-Lewis_Hamilton_2016_Malaysia_2.jpg',
    banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/twentythree/Monaco_Formula_1_Grand_Prix.jpg/800px-Monaco_Grand_Prix.jpg'
  },
  {
    id: '4',
    teamA: 'N. Djokovic',
    teamB: 'C. Alcaraz',
    score: 'VS',
    tournament: 'Wimbledon Cup',
    events: [],
    startTime: '14:05',
    league: 'Semi-Finals',
    genre: 'tennis',
    date: '2026-05-22', // FRI
    region: 'Europe',
    isIndividual: true,
    logoA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Novak_Djokovic_at_the_2023_US_Open_%28cropped%29.jpg/800px-Novak_Djokovic_at_the_2023_US_Open_%28cropped%29.jpg',
    logoB: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Carlos_Alcaraz_%28ESP%29_2022.jpg/800px-Carlos_Alcaraz_%28ESP%29_2022.jpg',
    banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Wimbledon_Centre_Court_2010.jpg/800px-Wimbledon_Centre_Court_2010.jpg'
  },
  {
    id: '5',
    teamA: 'Liverpool',
    teamB: 'Chelsea',
    score: '3 - 2',
    tournament: 'Premier League',
    events: ["GOAL! Liverpool 1-0 (12')", "GOAL! Chelsea 1-1 (34')", "GOAL! Chelsea 1-2 (55')", "GOAL! Liverpool 2-2 (72')", "GOAL! Liverpool 3-2 (88')"],
    startTime: '20:45',
    league: 'Fixture 38',
    genre: 'football',
    date: '2026-05-20', // WED
    region: 'Europe',
    logoA: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
    logoB: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
    banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Anfield_%28Liverpool_F.C._Stadium%29.jpg/800px-Anfield_%28Liverpool_F.C._Stadium%29.jpg'
  },
  {
    id: '6',
    teamA: 'Warriors',
    teamB: 'Suns',
    score: '112 - 104',
    tournament: 'NBA Playoffs',
    events: ["Q1: Suns start hot, Booker scores 12", "Q4: Curry seals victory with three consecutives 3s"],
    startTime: '22:00',
    league: 'Western Conference',
    genre: 'basketball',
    date: '2026-05-18', // MON
    region: 'USA',
    logoA: 'https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg',
    logoB: 'https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg',
    banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chase_Center_San_Francisco_2019.jpg/800px-Chase_Center_San_Francisco_2019.jpg'
  },
  {
    id: '7',
    teamA: 'C. Alcaraz',
    teamB: 'J. Sinner',
    score: 'LIVE',
    tournament: 'French Open',
    events: ["Set 1: Alcaraz 6-4", "Set 2: Sinner 7-5", "Set 3: Alcaraz leading 3-1"],
    startTime: 'LIVE',
    league: 'Quarter-Finals',
    genre: 'tennis',
    date: '2026-05-19', // TUE
    region: 'Europe',
    isIndividual: true,
    logoA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Carlos_Alcaraz_%28ESP%29_2022.jpg/800px-Carlos_Alcaraz_%28ESP%29_2022.jpg',
    logoB: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Jannik_Sinner_2021.jpg/800px-Jannik_Sinner_2021.jpg',
    banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Court_Philippe-Chatrier_%282%29.jpg/800px-Court_Philippe-Chatrier_%282%29.jpg'
  },
  {
    id: '8',
    teamA: 'Arsenal',
    teamB: 'Bayern Munich',
    score: 'VS',
    tournament: 'Champions League',
    events: [],
    startTime: '20:00',
    league: 'Quarter Finals',
    genre: 'football',
    date: '2026-05-23', // SAT
    region: 'Europe',
    logoA: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
    logoB: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
    banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Emirates_Stadium_east_side_at_dusk.jpg/800px-Emirates_Stadium_east_side_at_dusk.jpg'
  },
  {
    id: '9',
    teamA: 'M. Verstappen',
    teamB: 'C. Leclerc',
    score: 'VS',
    tournament: 'British GP',
    events: [],
    startTime: '13:00',
    league: 'Qualifying',
    genre: 'f1',
    date: '2026-05-24', // SUN
    region: 'Global',
    isIndividual: true,
    logoA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Max_Verstappen_2017_Malaysia_3.jpg/800px-Max_Verstappen_2017_Malaysia_3.jpg',
    logoB: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Charles_Leclerc_2019.jpg/800px-Charles_Leclerc_2019.jpg',
    banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Silverstone_Circuit._The_Home_of_British_Motor_Racing.jpg/800px-Silverstone_Circuit._The_Home_of_British_Motor_Racing.jpg'
  },
  {
    id: '10',
    teamA: 'T1',
    teamB: 'Gen.G',
    score: '1 - 0',
    tournament: 'LCK Summer',
    events: ["First Blood! T1 (Faker) 1-0 (04')", "Baron Secured by T1 (28')"],
    startTime: 'LIVE',
    league: 'Playoffs',
    genre: 'esports',
    date: '2026-05-22', // FRI
    region: 'Global',
    logoA: 'https://upload.wikimedia.org/wikipedia/en/f/f9/T1_logo.svg',
    logoB: 'https://upload.wikimedia.org/wikipedia/en/9/91/Gen.G_Esports_logo.svg',
    banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/IEM_Katowice_2018.jpg/800px-IEM_Katowice_2018.jpg'
  },
  {
    id: '11',
    teamA: 'Sentinels',
    teamB: 'Fnatic',
    score: 'VS',
    tournament: 'VCT Masters',
    events: [],
    startTime: '19:30',
    league: 'Grand Finals',
    genre: 'esports',
    date: '2026-05-22', // FRI
    region: 'Global',
    logoA: 'https://upload.wikimedia.org/wikipedia/en/9/95/Sentinels_logo.svg',
    logoB: 'https://upload.wikimedia.org/wikipedia/en/4/43/Fnatic_logo.svg',
    banner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/IEM_Katowice_2018.jpg/800px-IEM_Katowice_2018.jpg'
  }
];
