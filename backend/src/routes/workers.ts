import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all workers
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const workers = await prisma.worker.findMany({
      include: {
        attendance: true,
      },
    });

    res.json(workers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create worker
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, jobTitle, phone, salary, hireDate } = req.body;

    if (!name || !jobTitle || !phone || !salary) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    const worker = await prisma.worker.create({
      data: {
        name,
        jobTitle,
        phone,
        salary: parseFloat(salary),
        hireDate: new Date(hireDate),
        status: 'ACTIVE',
      },
    });

    res.status(201).json(worker);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Record attendance
router.post('/:id/attendance', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { date, status } = req.body;

    if (!date || !status) {
      return res.status(400).json({ error: 'التاريخ والحالة مطلوبة' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        date: new Date(date),
        status,
        workerId: req.params.id,
      },
    });

    res.status(201).json(attendance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
