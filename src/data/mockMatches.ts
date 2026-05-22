import { Match } from '../types';

import regeneratedImage1779435225251 from '../assets/images/regenerated_image_1779435225251.webp';
import regeneratedImage1779435227191 from '../assets/images/regenerated_image_1779435227191.webp';
import regeneratedImage1779435228417 from '../assets/images/regenerated_image_1779435228417.jpg';
import regeneratedImage1779435229749 from '../assets/images/regenerated_image_1779435229749.avif';
import regeneratedImage1779435231994 from '../assets/images/regenerated_image_1779435231994.png';
import regeneratedImage1779435232898 from '../assets/images/regenerated_image_1779435232898.avif';
import regeneratedImage1779435234587 from '../assets/images/regenerated_image_1779435234587.avif';
import regeneratedImage1779435236613 from '../assets/images/regenerated_image_1779435236613.webp';
import regeneratedImage1779435240600 from '../assets/images/"https://placehold.co/400x300?text=Match"';
import regeneratedImage1779435241524 from '../assets/images/regenerated_image_1779435241524.jpg';
import regeneratedImage1779435242362 from '../assets/images/regenerated_image_1779435242362.svg';
import regeneratedImage1779435243056 from '../assets/images/regenerated_image_1779435243056.svg';
import regeneratedImage1779435244214 from '../assets/images/regenerated_image_1779435244214.png';
import regeneratedImage1779435246070 from '../assets/images/regenerated_image_1779435246070.avif';
import regeneratedImage1779435248560 from '../assets/images/regenerated_image_1779435248560.jpg';
import regeneratedImage1779435249154 from '../assets/images/regenerated_image_1779435249154.webp';
import regeneratedImage1779435254626 from '../assets/images/regenerated_image_1779435254626.svg';

import regeneratedImage1779435977801 from '../assets/images/regenerated_image_1779435977801.avif';
import regeneratedImage1779435979862 from '../assets/images/regenerated_image_1779435979862.webp';
import regeneratedImage1779435982934 from '../assets/images/regenerated_image_1779435982934.png';
import regeneratedImage1779435983710 from '../assets/images/regenerated_image_1779435983710.avif';
import regeneratedImage1779435985046 from '../assets/images/regenerated_image_1779435985046.svg';
import regeneratedImage1779435985602 from '../assets/images/regenerated_image_1779435985602.png';
import regeneratedImage1779435988021 from '../assets/images/regenerated_image_1779435988021.png';
import regeneratedImage1779435991006 from '../assets/images/regenerated_image_1779435991006.jpg';
import regeneratedImage1779435991710 from '../assets/images/regenerated_image_1779435991710.svg';
import regeneratedImage1779435993656 from '../assets/images/regenerated_image_1779435993656.webp';
import regeneratedImage1779435994747 from '../assets/images/regenerated_image_1779435994747.avif';
import regeneratedImage1779435996537 from '../assets/images/regenerated_image_1779435996537.jpg';
import regeneratedImage1779435997858 from '../assets/images/regenerated_image_1779435997858.webp';

import regeneratedImage1779438920868 from '../assets/images/regenerated_image_1779438920868.jpg';
import regeneratedImage1779438921601 from '../assets/images/regenerated_image_1779438921601.svg';
import regeneratedImage1779438922254 from '../assets/images/regenerated_image_1779438922254.png';
import regeneratedImage1779438923243 from '../assets/images/regenerated_image_1779438923243.webp';
import regeneratedImage1779438924678 from '../assets/images/regenerated_image_1779438924678.jpg';
import regeneratedImage1779438925241 from '../assets/images/regenerated_image_1779438925241.svg';
import regeneratedImage1779438925789 from '../assets/images/regenerated_image_1779438925789.svg';

export const mockMatches: Match[] = [
  {
    id: '1',
    teamA: 'Real Madrid',
    teamB: 'Man City',
    score: '2 - 1',
    tournament: 'Champions League',
    events: ["GOAL! Real Madrid 1-0 (24')", "GOAL! Man City 1-1 (48')", "GOAL! Real Madrid 2-1 (65\')", "Substitution (72\')"],
    startTime: 'LIVE',
    league: 'Group A',
    genre: 'football',
    date: '2026-05-22', // FRI
    region: 'Europe',
    logoA: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
    logoB: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
    banner: regeneratedImage1779435225251
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
    banner: regeneratedImage1779435227191
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
    logoA: regeneratedImage1779435228417,
    logoB: regeneratedImage1779435229749,
    banner: regeneratedImage1779435977801
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
    logoA: regeneratedImage1779435982934,
    logoB: regeneratedImage1779435983710,
    banner: regeneratedImage1779435979862
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
    banner: regeneratedImage1779435240600
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
    logoB: regeneratedImage1779438922254,
    banner: regeneratedImage1779435241524
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
    logoA: regeneratedImage1779435988021,
    logoB: regeneratedImage1779435991006,
    banner: regeneratedImage1779435985602
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
    logoB: regeneratedImage1779438923243,
    banner: regeneratedImage1779435993656
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
    logoA: regeneratedImage1779435996537,
    logoB: regeneratedImage1779435997858,
    banner: regeneratedImage1779435994747
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
    logoB: regeneratedImage1779438921601,
    banner: regeneratedImage1779438920868
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
    logoA: regeneratedImage1779438925241,
    logoB: regeneratedImage1779438925789,
    banner: regeneratedImage1779438924678
  }
];
