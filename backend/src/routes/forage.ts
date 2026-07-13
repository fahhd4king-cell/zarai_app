import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Forage calculator
router.post('/calculate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const {
      sheepCount,
      dailyConsumption,
      forageProductivity,
      foragePrice,
    } = req.body;

    if (!sheepCount || !dailyConsumption || !forageProductivity || !foragePrice) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    // Calculations
    const sheepNum = parseFloat(sheepCount);
    const dailyConsumptionNum = parseFloat(dailyConsumption);
    const forageProductivityNum = parseFloat(forageProductivity);
    const foragePriceNum = parseFloat(foragePrice);

    const dailyNeed = sheepNum * dailyConsumptionNum; // kg
    const yearlyNeed = dailyNeed * 365; // kg
    const requiredArea = yearlyNeed / forageProductivityNum; // hectares
    const yearlyCost = yearlyNeed * (foragePriceNum / 1000); // assuming price is per ton

    res.json({
      sheepCount: sheepNum,
      dailyConsumption: dailyConsumptionNum,
      forageProductivity: forageProductivityNum,
      foragePrice: foragePriceNum,
      results: {
        dailyNeed: Math.round(dailyNeed * 100) / 100,
        yearlyNeed: Math.round(yearlyNeed * 100) / 100,
        requiredArea: Math.round(requiredArea * 100) / 100,
        yearlyCost: Math.round(yearlyCost * 100) / 100,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
