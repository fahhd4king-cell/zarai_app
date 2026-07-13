import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import axios from 'axios';

const router = express.Router();
const prisma = new PrismaClient();

// Diagnose disease (using Claude AI)
router.post('/diagnose', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { cropId, imageUrl, symptoms } = req.body;

    if (!cropId || !imageUrl) {
      return res.status(400).json({ error: 'معرف المحصول و الصورة مطلوبة' });
    }

    // Call Claude API for diagnosis
    const claudeResponse = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `أنت خبير أمراض النبات. حلل الصورة التالية للمحصول وحدد الأمراض المحتملة والعلاج المناسب. الأعراض: ${symptoms || 'لم تحدد'}. قدم إجابة مختصرة بصيغة JSON مع الحقول: diagnosis, severity, treatment`,
          },
        ],
      },
      {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
        },
      }
    );

    const diagnosisText =
      claudeResponse.data.content[0].type === 'text'
        ? claudeResponse.data.content[0].text
        : 'لم يتمكن من التحليل';

    // Try to parse JSON from response
    let diagnosis, severity, treatment;
    try {
      const jsonMatch = diagnosisText.match(/\{[^}]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        diagnosis = parsed.diagnosis || 'غير محدد';
        severity = parsed.severity || 'متوسطة';
        treatment = parsed.treatment || 'استشر متخصص';
      } else {
        diagnosis = diagnosisText;
        severity = 'متوسطة';
        treatment = 'استشر متخصص';
      }
    } catch (e) {
      diagnosis = diagnosisText;
      severity = 'متوسطة';
      treatment = 'استشر متخصص';
    }

    // Save disease record
    const disease = await prisma.disease.create({
      data: {
        name: diagnosis,
        description: symptoms || 'تم التشخيص من الصورة',
        severity,
        imageUrl,
        diagnosis,
        treatment,
        cropId,
      },
    });

    res.status(201).json(disease);
  } catch (error: any) {
    console.error('Disease diagnosis error:', error);
    res.status(500).json({ error: error.message || 'خطأ في التشخيص' });
  }
});

// Get crop diseases
router.get('/crop/:cropId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const diseases = await prisma.disease.findMany({
      where: { cropId: req.params.cropId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(diseases);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
