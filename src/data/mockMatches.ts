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
    banner: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'
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
    banner: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'
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
    logoA: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=VER',
    logoB: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=HAM',
    banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
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
    logoA: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=DJO',
    logoB: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=ALC',
    banner: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800'
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
    banner: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'
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
    logoB: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=SUNS',
    banner: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'
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
    logoA: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=ALC',
    logoB: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=SIN',
    banner: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800'
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
    logoB: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=BAY',
    banner: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'
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
    logoA: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=VER',
    logoB: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=LEC',
    banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
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
    logoB: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=GENG',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
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
    logoA: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=SEN',
    logoB: 'https://placehold.co/100x100/1a1a2e/38bdf8?text=FNC',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
  }
];
