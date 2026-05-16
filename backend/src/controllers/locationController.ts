import { Router, Response, Request } from 'express';

const router = Router();

// Get locations
router.get('/', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Locations endpoint' });
});

export default router;
