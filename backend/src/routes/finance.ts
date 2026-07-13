import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all transactions
router.get('/transactions', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user?.id },
      include: {
        farm: true,
      },
      orderBy: { date: 'desc' },
    });

    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create transaction
router.post('/transactions', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { type, amount, description, farmId } = req.body;

    if (!type || !amount || !description) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        description,
        userId: req.user?.id || '',
        farmId: farmId || null,
        date: new Date(),
      },
    });

    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get financial report
router.get('/report', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user?.id },
    });

    const income = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = income - expenses;

    res.json({
      income,
      expenses,
      profit,
      transactionCount: transactions.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
