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

    const superAdmin = await User.create({
      name: 'Super Admin User',
      email: 'admin@tournament.com',
      password: plainPassword,
      role: 'Super Admin',
      status: 'active',
      isEmailVerified: true,
    });

    const organizer = await User.create({
      name: 'Organizer User',
      email: 'organizer@tournament.com',
      password: plainPassword,
      role: 'Organizer',
      status: 'active',
      isEmailVerified: true,
      createdBy: superAdmin._id,
    });

    const manager1 = await User.create({
      name: 'Manager Team A',
      email: 'manager1@tournament.com',
      password: plainPassword,
      role: 'Team Manager',
      status: 'active',
      isEmailVerified: true,
      createdBy: superAdmin._id,
    });

    const manager2 = await User.create({
      name: 'Manager Team B',
      email: 'manager2@tournament.com',
      password: plainPassword,
      role: 'Team Manager',
      status: 'active',
      isEmailVerified: true,
      createdBy: superAdmin._id,
    });

    const referee = await User.create({
      name: 'Referee User',
      email: 'referee@tournament.com',
      password: plainPassword,
      role: 'Referee',
      status: 'active',
      isEmailVerified: true,
      createdBy: superAdmin._id,
    });

    // Players accounts
    const playerUser1 = await User.create({
      name: 'Lionel Messi',
      email: 'messi@tournament.com',
      password: plainPassword,
      role: 'Player',
      status: 'active',
      isEmailVerified: true,
      createdBy: superAdmin._id,
    });

    const playerUser2 = await User.create({
      name: 'Cristiano Ronaldo',
      email: 'ronaldo@tournament.com',
      password: plainPassword,
      role: 'Player',
      status: 'active',
      isEmailVerified: true,
      createdBy: superAdmin._id,
    });

    console.log('👥 Users seeded successfully.');

    // 3) Seed Sports
    console.log('⚽ Seeding sports...');
    const soccer = await Sport.create({
      name: 'Soccer',
      type: 'team',
      rules: 'Standard FIFA rules: 11 players per team, 90 minutes match.',
      status: 'active',
      createdBy: superAdmin._id,
    });

    await Sport.create({
      name: 'Cricket',
      type: 'team',
      rules: 'Standard T20 international rules.',
      status: 'active',
      createdBy: superAdmin._id,
    });
    console.log('⚽ Sports seeded successfully.');

    // 4) Seed Teams
    console.log('🛡️ Seeding teams...');
    const teamA = await Team.create({
      name: 'FC Barcelona',
      manager: manager1._id,
      logo: 'https://res.cloudinary.com/demo/image/upload/v1580976523/barcelona.png',
      status: 'active',
      createdBy: organizer._id,
    });

    const teamB = await Team.create({
      name: 'Real Madrid',
      manager: manager2._id,
      logo: 'https://res.cloudinary.com/demo/image/upload/v1580976523/madrid.png',
      status: 'active',
      createdBy: organizer._id,
    });
    console.log('🛡️ Teams seeded successfully.');

    // 5) Seed Players Profiles
    console.log('👟 Seeding player profiles...');
    await Player.create({
      user: playerUser1._id,
      team: teamA._id,
      position: 'Forward',
      jerseyNumber: 10,
      bio: 'Argentine professional footballer playing as a forward.',
      stats: {
        matchesPlayed: 5,
        goals: 7,
        assists: 3,
        yellowCards: 0,
        redCards: 0,
      },
      createdBy: organizer._id,
    });

    await Player.create({
      user: playerUser2._id,
      team: teamB._id,
      position: 'Forward',
      jerseyNumber: 7,
      bio: 'Portuguese professional footballer playing as a forward.',
      stats: {
        matchesPlayed: 5,
        goals: 6,
        assists: 1,
        yellowCards: 1,
        redCards: 0,
      },
      createdBy: organizer._id,
    });
    console.log('👟 Player profiles seeded successfully.');

    // 6) Seed Tournaments
    console.log('🏆 Seeding tournaments...');
    const tournament = await Tournament.create({
      name: 'Champions Cup 2026',
      sport: soccer._id,
      season: 'Summer 2026',
      startDate: new Date('2026-06-01T00:00:00Z'),
      endDate: new Date('2026-08-30T00:00:00Z'),
      format: 'league',
      teams: [teamA._id, teamB._id],
      status: 'live',
      organizer: organizer._id,
      banner: 'https://res.cloudinary.com/demo/image/upload/v1580976523/champions_cup.png',
      createdBy: organizer._id,
    });
    console.log('🏆 Tournaments seeded successfully.');

    // 7) Seed Match
    console.log('📅 Seeding fixtures & matches...');
    await Match.create({
      tournament: tournament._id,
      homeTeam: teamA._id,
      awayTeam: teamB._id,
      venue: 'Estadio Metropolitano',
      referee: referee._id,
      date: new Date('2026-07-20T18:00:00Z'),
      status: 'scheduled',
      score: { homeTeam: 0, awayTeam: 0 },
      events: [],
      createdBy: organizer._id,
    });
    console.log('📅 Match fixtures seeded successfully.');

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
