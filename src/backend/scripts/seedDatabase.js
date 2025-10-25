const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Monastery = require('../models/Monastery');
const Festival = require('../models/Festival');
const Guide = require('../models/Guide');
const Homestay = require('../models/Homestay');
const Product = require('../models/Product');

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sikkim-monasteries');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Monastery.deleteMany({});
    await Festival.deleteMany({});
    await Guide.deleteMany({});
    await Homestay.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
    const admin = new User({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@sikkimmonasteries.com',
      password: adminPassword,
      role: 'admin',
      isVerified: true
    });
    await admin.save();
    console.log('Admin user created');

    // Create sample monasteries
    const monasteries = [
      {
        name: 'Rumtek Monastery',
        description: 'The largest monastery in Sikkim, known as the Dharma Chakra Centre',
        location: {
          address: 'Gangtok, East Sikkim',
          coordinates: { lat: 27.3389, lng: 88.5753 },
          district: 'East Sikkim'
        },
        tradition: 'Kagyu',
        established: '1966',
        images: [{
          url: 'https://images.unsplash.com/photo-1733111248500-fe2ff4d3ccff',
          caption: 'Rumtek Monastery exterior',
          isPrimary: true
        }],
        details: {
          foundedBy: '16th Karmapa',
          significance: 'Seat of the Karmapa in exile',
          architecture: 'Traditional Tibetan architecture',
          ceremonies: ['Cham dance', 'Prayer ceremonies'],
          visitingHours: {
            opening: '06:00',
            closing: '18:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          }
        },
        facilities: {
          parking: true,
          meditation: true,
          library: true
        },
        featured: true
      },
      {
        name: 'Enchey Monastery',
        description: 'One of the most important monasteries in Sikkim with a 200-year history',
        location: {
          address: 'Gangtok, East Sikkim',
          coordinates: { lat: 27.3353, lng: 88.6140 },
          district: 'East Sikkim'
        },
        tradition: 'Nyingma',
        established: '1840',
        images: [{
          url: 'https://images.unsplash.com/photo-1717738979582-aa23dd492fbb',
          caption: 'Enchey Monastery buildings',
          isPrimary: true
        }],
        details: {
          significance: 'Important Nyingma monastery',
          ceremonies: ['Annual Cham dance'],
          visitingHours: {
            opening: '06:00',
            closing: '17:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          }
        }
      },
      {
        name: 'Tashiding Monastery',
        description: 'Sacred monastery built on a heart-shaped hill between holy rivers',
        location: {
          address: 'West Sikkim',
          coordinates: { lat: 27.3433, lng: 88.2367 },
          district: 'West Sikkim'
        },
        tradition: 'Nyingma',
        established: '1641',
        images: [{
          url: 'https://images.unsplash.com/photo-1665730365086-244792392a21',
          caption: 'Tashiding Monastery in West Sikkim',
          isPrimary: true
        }],
        details: {
          significance: 'Very sacred site in Sikkim Buddhism',
          ceremonies: ['Bumchu festival'],
          visitingHours: {
            opening: '05:30',
            closing: '18:30',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          }
        }
      }
    ];

    const createdMonasteries = await Monastery.insertMany(monasteries);
    console.log('Sample monasteries created');

    // Create sample festivals
    const festivals = [
      {
        name: 'Losar Festival',
        description: 'Tibetan New Year celebration with traditional dances and ceremonies',
        monastery: createdMonasteries[0]._id,
        dates: {
          start: new Date('2024-02-10'),
          end: new Date('2024-02-12'),
          isRecurring: true,
          recurrencePattern: 'annually'
        },
        schedule: [
          { time: '06:00', activity: 'Morning prayers', location: 'Main hall' },
          { time: '10:00', activity: 'Cham dance', location: 'Courtyard' },
          { time: '14:00', activity: 'Traditional feast', location: 'Community hall' }
        ],
        categories: ['religious', 'cultural'],
        featured: true,
        status: 'upcoming'
      }
    ];

    await Festival.insertMany(festivals);
    console.log('Sample festivals created');

    // Create sample users
    const users = [
      {
        name: 'Tenzin Norbu',
        email: 'tenzin@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'guide',
        phone: '+91-9832-567-890',
        isVerified: true
      },
      {
        name: 'Pema Lhamo',
        email: 'pema@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'host',
        phone: '+91-9876-543-210',
        isVerified: true
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Sample users created');

    // Create sample guide profile
    const guide = new Guide({
      user: createdUsers[0]._id,
      profile: {
        name: 'Tenzin Norbu',
        phone: '+91-9832-567-890',
        experience: '8 years',
        languages: ['English', 'Hindi', 'Nepali', 'Bhutia'],
        specialties: ['Monastery Tours', 'Buddhist Philosophy', 'Cultural Heritage']
      },
      pricing: {
        baseRate: 2500,
        rateType: 'per-day'
      },
      services: ['monastery-tours', 'cultural-heritage', 'spiritual-counseling'],
      coverage: {
        areas: ['Gangtok', 'East Sikkim'],
        monasteries: [createdMonasteries[0]._id, createdMonasteries[1]._id]
      },
      availability: {
        schedule: [
          { day: 'monday', available: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
          { day: 'tuesday', available: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
          { day: 'wednesday', available: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
          { day: 'thursday', available: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
          { day: 'friday', available: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
          { day: 'saturday', available: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
          { day: 'sunday', available: false, timeSlots: [] }
        ]
      },
      verification: {
        isVerified: true,
        verifiedBy: admin._id,
        verifiedAt: new Date()
      },
      status: 'active',
      ratings: { average: 4.9, count: 156 }
    });

    await guide.save();
    console.log('Sample guide created');

    // Create sample homestay
    const homestay = new Homestay({
      name: "Pema's Traditional Home",
      host: {
        user: createdUsers[1]._id,
        name: 'Pema Lhamo',
        phone: '+91-9876-543-210',
        verified: true
      },
      location: {
        address: 'Near Rumtek Monastery, Gangtok',
        coordinates: { lat: 27.3400, lng: 88.5760 },
        nearbyMonastery: 'Rumtek Monastery',
        district: 'East Sikkim'
      },
      accommodation: {
        type: 'private-room',
        capacity: 4,
        bedrooms: 2,
        bathrooms: 1,
        beds: 2
      },
      pricing: {
        basePrice: 1500,
        priceType: 'per-night'
      },
      amenities: ['breakfast', 'mountain-view', 'cultural-activities', 'traditional-cooking'],
      description: 'Experience authentic Sikkimese culture in a traditional home with panoramic mountain views.',
      status: 'active',
      ratings: { average: 4.9, count: 45 }
    });

    await homestay.save();
    console.log('Sample homestay created');

    // Create sample products
    const products = [
      {
        name: 'Traditional Singing Bowl',
        description: 'Hand-forged bronze singing bowl used for meditation and healing',
        artisan: {
          name: 'Tenzin Metalworks',
          verified: true
        },
        category: 'spiritual',
        pricing: {
          basePrice: 3500
        },
        images: [{
          url: 'https://images.unsplash.com/photo-1579755219070-739e0c0ef539',
          isPrimary: true
        }],
        inventory: {
          stock: 25
        },
        status: 'active',
        featured: true,
        ratings: { average: 4.9, count: 78 }
      },
      {
        name: 'Handwoven Prayer Flags',
        description: 'Set of 25 colorful prayer flags with traditional mantras',
        artisan: {
          name: "Dolma's Textile Studio",
          verified: true
        },
        category: 'spiritual',
        pricing: {
          basePrice: 850
        },
        images: [{
          url: 'https://images.unsplash.com/photo-1756005913783-8339e559c406',
          isPrimary: true
        }],
        inventory: {
          stock: 50
        },
        status: 'active',
        ratings: { average: 4.8, count: 92 }
      }
    ];

    await Product.insertMany(products);
    console.log('Sample products created');

    console.log('Database seeding completed successfully!');
    console.log('\nLogin credentials:');
    console.log(`Admin: ${admin.email} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`Guide: ${createdUsers[0].email} / password123`);
    console.log(`Host: ${createdUsers[1].email} / password123`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
seedDatabase();