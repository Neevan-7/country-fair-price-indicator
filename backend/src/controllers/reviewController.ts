import { Router, Response, Request } from 'express';

const router = Router();

// Get reviews
router.get('/:priceId', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Reviews endpoint' });
});

export default router;
