const { prisma } = require('../db');

// Create a new insurance prediction record
exports.createRecord = async (req, res) => {
  try {
    const { age, sex, bmi, children, smoker, region, prediction } = req.body;
    const userId = req.user.id;

    const record = await prisma.insuranceRecord.create({
      data: {
        age,
        sex,
        bmi,
        children,
        smoker,
        region,
        prediction,
        userId
      }
    });

    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all records for the logged-in user
exports.getRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await prisma.insuranceRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a record
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const record = await prisma.insuranceRecord.findUnique({
      where: { id }
    });

    if (!record || record.userId !== userId) {
      return res.status(404).json({ message: 'Record not found' });
    }

    await prisma.insuranceRecord.delete({ where: { id } });
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
