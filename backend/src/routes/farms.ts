import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all farms
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const farms = await prisma.farm.findMany({
      where: { userId: req.user?.id },
      include: {
        fields: true,
        livestock: true,
      },
    });

    res.json(farms);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get farm by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const farm = await prisma.farm.findUnique({
      where: { id: req.params.id },
      include: {
        fields: {
          include: {
            crops: true,
          },
        },
        livestock: true,
        transactions: true,
      },
    });

    if (!farm) {
      return res.status(404).json({ error: 'المزرعة غير موجودة' });
    }

    if (farm.userId !== req.user?.id) {
      return res.status(403).json({ error: 'غير مصرح' });
    }

    res.json(farm);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create farm
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, location, area } = req.body;

    if (!name || !location || !area) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    const farm = await prisma.farm.create({
      data: {
        name,
        location,
        area: parseFloat(area),
        userId: req.user?.id || '',
      },
    });

    res.status(201).json(farm);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update farm
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const farm = await prisma.farm.findUnique({
      where: { id: req.params.id },
    });

    if (!farm) {
      return res.status(404).json({ error: 'المزرعة غير موجودة' });
    }

    if (farm.userId !== req.user?.id) {
      return res.status(403).json({ error: 'غير مصرح' });
    }

    const updatedFarm = await prisma.farm.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(updatedFarm);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete farm
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const farm = await prisma.farm.findUnique({
      where: { id: req.params.id },
    });

    if (!farm) {
      return res.status(404).json({ error: 'المزرعة غير موجودة' });
    }

    if (farm.userId !== req.user?.id) {
      return res.status(403).json({ error: 'غير مصرح' });
    }

    await prisma.farm.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'تم حذف المزرعة بنجاح' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
