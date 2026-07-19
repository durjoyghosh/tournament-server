import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../modules/user/user.model';
import { Sport } from '../modules/tournament/sport.model';
import { Tournament } from '../modules/tournament/tournament.model';
import { Team } from '../modules/team/team.model';
import { Player } from '../modules/player/player.model';
import { Match } from '../modules/match/match.model';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tournament-manager';
    console.log(`🌱 Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Database connected.');

    // 1) Clear Existing Data
    console.log('🗑️ Clearing existing collections...');
    await User.deleteMany({});
    await Sport.deleteMany({});
    await Tournament.deleteMany({});
    await Team.deleteMany({});
    await Player.deleteMany({});
    await Match.deleteMany({});
    console.log('🗑️ Database cleared.');

    // 2) Seed Users
    console.log('👥 Seeding users...');
    const plainPassword = 'password123';
    const adminPassword = 'Aa@#1122';

    // Super Admins
    const superAdmin1 = await User.create({
      name: 'Durjoy Ghosh',
      email: 'durjoy@gmail.com',
      password: adminPassword,
      role: 'Super Admin',
      status: 'active',
      isEmailVerified: true,
    });

    await User.create({
      name: 'Super Admin User',
      email: 'admin@tournament.com',
      password: plainPassword,
      role: 'Super Admin',
      status: 'active',
      isEmailVerified: true,
      createdBy: superAdmin1._id,
    });

    // Organizers
    const organizers = [];
    const organizerNames = ['Alex Mercer', 'Sarah Jenkins'];
    for (let i = 0; i < 2; i++) {
      const org = await User.create({
        name: organizerNames[i],
        email: `organizer${i + 1}@tournament.com`,
        password: plainPassword,
        role: 'Organizer',
        status: 'active',
        isEmailVerified: true,
        createdBy: superAdmin1._id,
      });
      organizers.push(org);
    }

    // Team Managers (10 managers)
    const managers = [];
    const managerNames = [
      'John Smith', 'David Miller', 'Michael Brown', 'James Wilson', 'Robert Taylor',
      'William Jones', 'Joseph Davis', 'Charles Garcia', 'Thomas Rodriguez', 'Daniel Martinez'
    ];
    for (let i = 0; i < 10; i++) {
      const mgr = await User.create({
        name: managerNames[i],
        email: `manager${i + 1}@tournament.com`,
        password: plainPassword,
        role: 'Team Manager',
        status: 'active',
        isEmailVerified: true,
        createdBy: superAdmin1._id,
      });
      managers.push(mgr);
    }

    // Referees (10 referees)
    const referees = [];
    const refereeNames = [
      'Howard Webb', 'Pierluigi Collina', 'Mark Clattenburg', 'Felix Brych', 'Cüneyt Çakır',
      'Nestor Pitana', 'Björn Kuipers', 'Danny Makkelie', 'Szymon Marciniak', 'Clément Turpin'
    ];
    for (let i = 0; i < 10; i++) {
      const ref = await User.create({
        name: refereeNames[i],
        email: `referee${i + 1}@tournament.com`,
        password: plainPassword,
        role: 'Referee',
        status: 'active',
        isEmailVerified: true,
        createdBy: superAdmin1._id,
      });
      referees.push(ref);
    }

    // Players accounts (10 players)
    const playerUsers = [];
    const playerNames = [
      'Lionel Messi', 'Cristiano Ronaldo', 'Marcus Rashford', 'Mohamed Salah', 'Thomas Müller',
      'Dusan Vlahovic', 'Kylian Mbappé', 'Enzo Fernández', 'Bukayo Saka', 'Rafael Leão'
    ];
    for (let i = 0; i < 10; i++) {
      const ply = await User.create({
        name: playerNames[i],
        email: `player${i + 1}@tournament.com`,
        password: plainPassword,
        role: 'Player',
        status: 'active',
        isEmailVerified: true,
        createdBy: superAdmin1._id,
      });
      playerUsers.push(ply);
    }

    console.log('👥 Users seeded successfully.');

    // 3) Seed Sports (10 sports)
    console.log('⚽ Seeding sports...');
    const sportsData = [
      { name: 'Soccer', type: 'team', rules: 'Standard FIFA rules: 11 players per team, 90 minutes match.' },
      { name: 'Cricket', type: 'team', rules: 'Standard T20 international rules.' },
      { name: 'Basketball', type: 'team', rules: 'Standard FIBA rules: 5 players per team, 4 quarters of 10 minutes.' },
      { name: 'Tennis', type: 'individual', rules: 'Standard ITF rules: Best of 3 or 5 sets.' },
      { name: 'Badminton', type: 'individual', rules: 'Standard BWF rules: Best of 3 games to 21 points.' },
      { name: 'Volleyball', type: 'team', rules: 'Standard FIVB rules: 6 players per team, best of 5 sets.' },
      { name: 'Rugby', type: 'team', rules: 'Standard World Rugby rules: 15 players per team.' },
      { name: 'Baseball', type: 'team', rules: 'Standard MLB rules: 9 players per team, 9 innings.' },
      { name: 'Table Tennis', type: 'individual', rules: 'Standard ITTF rules: Best of 5 or 7 games.' },
      { name: 'Hockey', type: 'team', rules: 'Standard FIH rules: 11 players per team, 4 quarters of 15 minutes.' }
    ];

    const sports = [];
    for (const sData of sportsData) {
      const spt = await Sport.create({
        ...sData,
        status: 'active',
        createdBy: superAdmin1._id,
      });
      sports.push(spt);
    }
    console.log('⚽ Sports seeded successfully.');

    // 4) Seed Teams (10 teams)
    console.log('🛡️ Seeding teams...');
    const teamNames = [
      'FC Barcelona', 'Real Madrid', 'Manchester United', 'Liverpool FC', 'Bayern Munich',
      'Juventus FC', 'Paris Saint-Germain', 'Chelsea FC', 'Arsenal FC', 'AC Milan'
    ];
    const cities = ['Barcelona', 'Madrid', 'Manchester', 'Liverpool', 'Munich', 'Turin', 'Paris', 'London', 'London', 'Milan'];
    const countries = ['Spain', 'Spain', 'United Kingdom', 'United Kingdom', 'Germany', 'Italy', 'France', 'United Kingdom', 'United Kingdom', 'Italy'];
    const logos = [
      'https://res.cloudinary.com/demo/image/upload/v1580976523/barcelona.png',
      'https://res.cloudinary.com/demo/image/upload/v1580976523/madrid.png',
      'https://res.cloudinary.com/demo/image/upload/v1580976523/manchester.png',
      'https://res.cloudinary.com/demo/image/upload/v1580976523/liverpool.png',
      'https://res.cloudinary.com/demo/image/upload/v1580976523/bayern.png',
      'https://res.cloudinary.com/demo/image/upload/v1580976523/juventus.png',
      'https://res.cloudinary.com/demo/image/upload/v1580976523/psg.png',
      'https://res.cloudinary.com/demo/image/upload/v1580976523/chelsea.png',
      'https://res.cloudinary.com/demo/image/upload/v1580976523/arsenal.png',
      'https://res.cloudinary.com/demo/image/upload/v1580976523/acmilan.png'
    ];

    const teams = [];
    for (let i = 0; i < 10; i++) {
      const tm = await Team.create({
        name: teamNames[i],
        manager: managers[i]._id,
        logo: logos[i],
        city: cities[i],
        country: countries[i],
        founded: 1890 + i * 2,
        status: 'active',
        createdBy: organizers[0]._id,
      });
      teams.push(tm);
    }
    console.log('🛡️ Teams seeded successfully.');

    // 5) Seed Players Profiles (10 players mapped to 10 player accounts and teams)
    console.log('👟 Seeding player profiles...');
    const positions = ['Forward', 'Forward', 'Forward', 'Forward', 'Midfielder', 'Forward', 'Forward', 'Midfielder', 'Forward', 'Forward'];
    const jerseyNumbers = [10, 7, 10, 11, 25, 9, 7, 8, 7, 10];
    const nationalities = ['Argentina', 'Portugal', 'United Kingdom', 'Egypt', 'Germany', 'Serbia', 'France', 'Argentina', 'United Kingdom', 'Portugal'];
    const bios = [
      'Argentine professional footballer playing as a forward.',
      'Portuguese professional footballer playing as a forward.',
      'English professional footballer playing as a winger.',
      'Egyptian professional footballer playing as a winger.',
      'German professional footballer playing as a midfielder.',
      'Serbian professional footballer playing as a striker.',
      'French professional footballer playing as a forward.',
      'Argentine professional footballer playing as a midfielder.',
      'English professional footballer playing as a winger.',
      'Portuguese professional footballer playing as a winger.'
    ];

    for (let i = 0; i < 10; i++) {
      await Player.create({
        user: playerUsers[i]._id,
        team: teams[i]._id,
        position: positions[i],
        jerseyNumber: jerseyNumbers[i],
        nationality: nationalities[i],
        age: 20 + i,
        height: `${1.70 + i * 0.02}m`,
        bio: bios[i],
        stats: {
          matchesPlayed: 10 + i,
          goals: 5 + i,
          assists: 2 + i,
          yellowCards: i % 3,
          redCards: i % 8 === 0 ? 1 : 0,
        },
        createdBy: organizers[0]._id,
      });
    }
    console.log('👟 Player profiles seeded successfully.');

    // 6) Seed Tournaments (10 tournaments)
    console.log('🏆 Seeding tournaments...');
    const tournamentNames = [
      'Champions Cup 2026', 'Premier Cricket League', 'Elite Basketball Tournament', 'Grand Tennis Open',
      'Volleyball Masters', 'Rugby Championship', 'World Baseball Series', 'Table Tennis Cup',
      'Ice Hockey Invitational', 'Badminton Super League'
    ];
    const formats = ['league', 'league', 'knockout', 'knockout', 'league', 'league', 'hybrid', 'knockout', 'hybrid', 'league'] as const;

    const tournaments = [];
    for (let i = 0; i < 10; i++) {
      // Each tournament gets a set of 4 teams
      const tournamentTeams = [
        teams[i % 10]._id,
        teams[(i + 1) % 10]._id,
        teams[(i + 2) % 10]._id,
        teams[(i + 3) % 10]._id
      ];

      const tour = await Tournament.create({
        name: tournamentNames[i],
        sport: sports[i % 10]._id,
        season: 'Summer 2026',
        description: `This is a high stakes ${sports[i % 10].name} tournament.`,
        location: `Stadium ${i + 1}`,
        startDate: new Date(`2026-06-${String(i + 1).padStart(2, '0')}T00:00:00Z`),
        endDate: new Date(`2026-08-30T00:00:00Z`),
        format: formats[i],
        teams: tournamentTeams,
        maxTeams: 16,
        prizePool: 50000 + i * 10000,
        status: i === 0 ? 'live' : 'upcoming',
        isPublished: true,
        organizer: organizers[i % 2]._id,
        banner: 'https://res.cloudinary.com/demo/image/upload/v1580976523/champions_cup.png',
        createdBy: organizers[i % 2]._id,
      });
      tournaments.push(tour);
    }
    console.log('🏆 Tournaments seeded successfully.');

    // 7) Seed Matches (10 matches)
    console.log('📅 Seeding fixtures & matches...');
    const venues = [
      'Camp Nou', 'Santiago Bernabéu', 'Old Trafford', 'Anfield', 'Allianz Arena',
      'Allianz Stadium', 'Parc des Princes', 'Stamford Bridge', 'Emirates Stadium', 'San Siro'
    ];

    for (let i = 0; i < 10; i++) {
      const tour = tournaments[i % 10];
      const matchHomeTeam = tour.teams[0];
      const matchAwayTeam = tour.teams[1];

      await Match.create({
        tournament: tour._id,
        homeTeam: matchHomeTeam,
        awayTeam: matchAwayTeam,
        venue: venues[i],
        referee: referees[i]._id,
        date: new Date(`2026-07-2${i}T18:00:00Z`),
        status: i === 0 ? 'completed' : i === 1 ? 'live' : 'scheduled',
        score: i === 0 ? { homeTeam: 2, awayTeam: 1 } : { homeTeam: 0, awayTeam: 0 },
        refereeStatus: 'accepted',
        refereeReport: i === 0 ? 'Clean match with no critical incidents.' : '',
        events: i === 0 ? [
          { type: 'goal', minute: 14, team: 'home', details: 'Scored by jersey number 10' },
          { type: 'goal', minute: 55, team: 'away', details: 'Equalizer' },
          { type: 'goal', minute: 88, team: 'home', details: 'Late winner' }
        ] : [],
        createdBy: organizers[0]._id,
      });
    }
    console.log('📅 Match fixtures seeded successfully.');

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
