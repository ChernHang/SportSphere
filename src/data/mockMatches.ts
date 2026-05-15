import { Match } from '../types';

export const mockMatches: Match[] = [
  {
    id: '1',
    teamA: 'Real Madrid',
    teamB: 'Man City',
    score: '2 - 1',
    tournament: 'Champions League',
    events: ['GOAL! London Ravens 2-1 (65\')', 'Substitution (72\')'],
    startTime: 'LIVE',
    league: 'Group A',
    genre: 'football'
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
    genre: 'basketball'
  },
  {
    id: '3',
    teamA: 'M. Verstappen',
    teamB: 'L. Hamilton',
    score: 'LAP 42/78',
    tournament: 'Monaco GP',
    events: [],
    startTime: 'LIVE',
    league: 'Race Day',
    genre: 'f1'
  }
];
