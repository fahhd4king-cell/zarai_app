import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all crops
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const crops = await prisma.crop.findMany({
      include: {
        field: {
          include: {
            farm: {
              where: { userId: req.user?.id },
            },
          },
        },
        diseases: true,
        harvests: true,
      },
    });

    res.json(crops);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create crop
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, plantingDate, expectedHarvestDate, quantity, fieldId } = req.body;

    if (!name || !type || !fieldId) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    const crop = await prisma.crop.create({
      data: {
        name,
        type,
        plantingDate: new Date(plantingDate),
        expectedHarvestDate: new Date(expectedHarvestDate),
        quantity: parseFloat(quantity),
        status: 'PLANTING',
        fieldId,
      },
    });

    res.status(201).json(crop);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update crop status
router.patch('/:id/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    const crop = await prisma.crop.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json(crop);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
