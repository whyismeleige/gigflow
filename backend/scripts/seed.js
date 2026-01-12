/**
 * GigFlow Database Seed Script
 * 
 * Run this script to populate your database with sample data:
 * node backend/seed.js
 * 
 * This will create:
 * - 5 users (clients/freelancers)
 * - 10 gigs (mix of open and assigned)
 * - 25+ bids (various statuses)
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import models
const User = require("../models/user.model");
const Gig = require("../models/gig.model");
const Bid = require("../models/bid.model");

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const getHashedPassword = (password = "Password123") => {
  return bcrypt.hashSync(password, 12);
} 

// Sample user data
const users = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: getHashedPassword(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    password: getHashedPassword(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
  },
  {
    name: "Charlie Davis",
    email: "charlie@example.com",
    password: getHashedPassword(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
  },
  {
    name: "Diana Prince",
    email: "diana@example.com",
    password: getHashedPassword(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
  },
  {
    name: "Ethan Hunt",
    email: "ethan@example.com",
    password: getHashedPassword(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
  },
];

// Sample gig data (will be populated with user IDs)
const gigsTemplate = [
  {
    title: "E-commerce Website Development",
    description: "Looking for an experienced developer to build a modern e-commerce website with payment integration, product catalog, and admin dashboard. Must have experience with React and Node.js. Timeline: 4-6 weeks.",
    budget: 75000,
    status: "open",
  },
  {
    title: "Mobile App UI/UX Design",
    description: "Need a talented designer to create mockups and prototypes for a fitness tracking mobile app. Should include user flows, wireframes, and high-fidelity designs. Experience with Figma required.",
    budget: 35000,
    status: "open",
  },
  {
    title: "SEO Optimization for Blog",
    description: "Seeking an SEO expert to optimize our tech blog for better search rankings. Tasks include keyword research, on-page SEO, meta tags, and content recommendations. Must show previous results.",
    budget: 20000,
    status: "open",
  },
  {
    title: "Python Data Analysis Script",
    description: "Need a Python developer to create scripts for analyzing sales data, generating reports, and creating visualizations using pandas and matplotlib. Clean, documented code required.",
    budget: 15000,
    status: "assigned",
  },
  {
    title: "WordPress Website Customization",
    description: "Looking for WordPress expert to customize theme, add custom features, optimize performance, and ensure mobile responsiveness. Must have portfolio of similar work.",
    budget: 25000,
    status: "open",
  },
  {
    title: "Social Media Marketing Campaign",
    description: "Need a social media marketer to create and manage a 3-month campaign across Instagram, Facebook, and Twitter. Must include content calendar, posts, and engagement strategy.",
    budget: 45000,
    status: "open",
  },
  {
    title: "Logo Design for Startup",
    description: "Startup needs a modern, minimalist logo design. Should provide 3-5 concepts with revisions. Vector files in multiple formats required. Must understand brand identity.",
    budget: 12000,
    status: "assigned",
  },
  {
    title: "Backend API Development",
    description: "Building a REST API for a booking system. Need Node.js/Express developer familiar with MongoDB, authentication, and real-time features using Socket.io. Documentation required.",
    budget: 55000,
    status: "open",
  },
  {
    title: "Video Editing for YouTube Channel",
    description: "Looking for video editor to edit 8-10 videos per month. Must include color correction, transitions, subtitles, and thumbnail creation. Experience with Premiere Pro/Final Cut required.",
    budget: 30000,
    status: "open",
  },
  {
    title: "Android App Bug Fixes",
    description: "Need Android developer to fix critical bugs in existing app, improve performance, and update deprecated dependencies. Must have experience with Kotlin and Android Studio.",
    budget: 18000,
    status: "assigned",
  },
];

// Bid messages templates
const bidMessages = [
  "Hello! I have extensive experience in this area and would love to work on your project. I've completed similar projects with great success. Let me know if you'd like to discuss further!",
  "Hi there! I'm very interested in this opportunity. I have the required skills and can deliver high-quality work within your timeline. Check out my portfolio for reference.",
  "Greetings! This project aligns perfectly with my expertise. I've been working in this field for 5+ years and have a proven track record. I'm confident I can exceed your expectations.",
  "Hey! I'd be happy to help with this project. I have all the necessary skills and tools. My approach would be to first understand your requirements fully, then deliver in iterations.",
  "Hi! I'm available to start immediately and can dedicate full time to this project. I've done similar work before and can show you examples. Let's discuss the details!",
  "Hello! Your project caught my attention. I have expertise in exactly what you need and can provide regular updates throughout. Looking forward to collaborating with you.",
];

// Clear existing data
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Gig.deleteMany({});
    await Bid.deleteMany({});
    console.log("🗑️  Cleared existing data");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  }
};

// Create users
const createUsers = async () => {
  try {
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error("❌ Error creating users:", error);
    throw error;
  }
};

// Create gigs
const createGigs = async (users) => {
  try {
    const gigs = gigsTemplate.map((gig, index) => ({
      ...gig,
      ownerId: users[index % users.length]._id, // Distribute gigs among users
    }));

    const createdGigs = await Gig.insertMany(gigs);
    console.log(`✅ Created ${createdGigs.length} gigs`);
    return createdGigs;
  } catch (error) {
    console.error("❌ Error creating gigs:", error);
    throw error;
  }
};

// Create bids
const createBids = async (users, gigs) => {
  try {
    const bids = [];

    // Create bids for each gig
    gigs.forEach((gig, gigIndex) => {
      // Determine number of bids (2-4 bids per gig)
      const numBids = Math.floor(Math.random() * 3) + 2;
      
      // Get freelancers (exclude gig owner)
      const availableFreelancers = users.filter(
        (user) => user._id.toString() !== gig.ownerId.toString()
      );

      // Shuffle and pick freelancers
      const selectedFreelancers = availableFreelancers
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(numBids, availableFreelancers.length));

      selectedFreelancers.forEach((freelancer, bidIndex) => {
        let status = "pending";
        
        // For assigned gigs, make one bid "hired" and others "rejected"
        if (gig.status === "assigned") {
          if (bidIndex === 0) {
            status = "hired";
            gig.hiredFreelancerId = freelancer._id;
          } else {
            status = "rejected";
          }
        }

        // Random proposed price (80% to 120% of budget)
        const priceVariation = 0.8 + Math.random() * 0.4;
        const proposedPrice = Math.round(gig.budget * priceVariation);

        bids.push({
          gigId: gig._id,
          freelancerId: freelancer._id,
          message: bidMessages[Math.floor(Math.random() * bidMessages.length)],
          proposedPrice,
          status,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
        });
      });
    });

    const createdBids = await Bid.insertMany(bids);
    
    // Update assigned gigs with hiredFreelancerId
    const updatePromises = gigs
      .filter((gig) => gig.status === "assigned" && gig.hiredFreelancerId)
      .map((gig) =>
        Gig.findByIdAndUpdate(gig._id, {
          hiredFreelancerId: gig.hiredFreelancerId,
        })
      );
    
    await Promise.all(updatePromises);
    
    console.log(`✅ Created ${createdBids.length} bids`);
    return createdBids;
  } catch (error) {
    console.error("❌ Error creating bids:", error);
    throw error;
  }
};

// Print summary
const printSummary = async () => {
  try {
    const userCount = await User.countDocuments();
    const gigCount = await Gig.countDocuments();
    const openGigCount = await Gig.countDocuments({ status: "open" });
    const assignedGigCount = await Gig.countDocuments({ status: "assigned" });
    const bidCount = await Bid.countDocuments();
    const pendingBidCount = await Bid.countDocuments({ status: "pending" });
    const hiredBidCount = await Bid.countDocuments({ status: "hired" });
    const rejectedBidCount = await Bid.countDocuments({ status: "rejected" });

    console.log("\n" + "=".repeat(50));
    console.log("📊 DATABASE SEED SUMMARY");
    console.log("=".repeat(50));
    console.log(`👥 Users: ${userCount}`);
    console.log(`💼 Total Gigs: ${gigCount}`);
    console.log(`   - Open: ${openGigCount}`);
    console.log(`   - Assigned: ${assignedGigCount}`);
    console.log(`📝 Total Bids: ${bidCount}`);
    console.log(`   - Pending: ${pendingBidCount}`);
    console.log(`   - Hired: ${hiredBidCount}`);
    console.log(`   - Rejected: ${rejectedBidCount}`);
    console.log("=".repeat(50));
    console.log("\n📧 Test User Credentials:");
    console.log("Email: alice@example.com | Password: Password123");
    console.log("Email: bob@example.com   | Password: Password123");
    console.log("Email: charlie@example.com | Password: Password123");
    console.log("Email: diana@example.com | Password: Password123");
    console.log("Email: ethan@example.com | Password: Password123");
    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("❌ Error printing summary:", error);
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seed...\n");

    await connectDB();
    await clearDatabase();
    
    const users = await createUsers();
    const gigs = await createGigs(users);
    const bids = await createBids(users, gigs);
    
    await printSummary();
    
    console.log("✅ Database seeded successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed process failed:", error);
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };