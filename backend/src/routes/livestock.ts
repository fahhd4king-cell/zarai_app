import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all livestock
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const livestock = await prisma.livestock.findMany({
      include: {
        farm: {
          where: { userId: req.user?.id },
        },
        feedRecords: true,
      },
    });

    res.json(livestock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create livestock group
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, quantity, purchaseDate, feedCost, farmId } = req.body;

    if (!name || !type || !quantity || !farmId) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    const livestock = await prisma.livestock.create({
      data: {
        name,
        type,
        quantity: parseInt(quantity),
        purchaseDate: new Date(purchaseDate),
        feedCost: parseFloat(feedCost),
        healthStatus: 'جيدة',
        farmId,
      },
    });

    res.status(201).json(livestock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add health record
router.post('/:id/health', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { feedAmount, waterAmount, medicineGiven, notes } = req.body;

    const record = await prisma.healthRecord.create({
      data: {
        feedAmount: parseFloat(feedAmount),
        waterAmount: waterAmount ? parseFloat(waterAmount) : null,
        medicineGiven,
        notes,
        livestockId: req.params.id,
      },
    });

    res.status(201).json(record);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
