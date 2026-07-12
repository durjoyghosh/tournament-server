export interface IAuthUser {
  id: string;
  email: string;
  role: 'Super Admin' | 'Organizer' | 'Team Manager' | 'Coach' | 'Player' | 'Referee' | 'Scorekeeper' | 'Spectator';
}
