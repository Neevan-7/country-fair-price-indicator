import { Router, Request, Response } from 'express';
import { PriceService } from '@services/priceService';
import { authMiddleware, AuthRequest } from '@middleware/authMiddleware';

const router = Router();
const priceService = new PriceService();

// Report a price
router.post('/report', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const priceData = await priceService.reportPrice({
      ...req.body,
      reportedBy: req.user?.id,
    });

    res.status(201).json({
      success: true,
      data: priceData,
      message: 'Price reported successfully',
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get prices by location
router.get('/location/:latitude/:longitude', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.params;
    const { radius = 5 } = req.query;

    const prices = await priceService.getPricesByLocation(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      parseInt(radius as string)
    );

    res.json({
      success: true,
      data: prices,
      count: prices.length,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get prices by product
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { product, location } = req.query;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required',
      });
    }

    const prices = await priceService.getPricesByProduct(
      product as string,
      location as string | undefined
    );

    res.json({
      success: true,
      data: prices,
      count: prices.length,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get average price
router.get('/average', async (req: Request, res: Response) => {
  try {
    const { product, location } = req.query;

    if (!product || !location) {
      return res.status(400).json({
        success: false,
        message: 'Product and location are required',
      });
    }

    const avgPrice = await priceService.getAveragePrice(
      product as string,
      location as string
    );

    res.json({
      success: true,
      data: { averagePrice: avgPrice },
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
