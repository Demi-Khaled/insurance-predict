require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('MySQL Connected via Prisma');
  } catch (error) {
    console.error(`Error connecting to MySQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, prisma };
