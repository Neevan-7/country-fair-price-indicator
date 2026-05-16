import { AppDataSource } from '@config/database';
import { Price } from '@models/Price';
import { Location } from '@models/Location';
import { AppError, NotFoundError } from '@utils/AppError';
import { LessThanOrEqual, GreaterThanOrEqual, Like } from 'typeorm';

export class PriceService {
  private priceRepository = AppDataSource.getRepository(Price);
  private locationRepository = AppDataSource.getRepository(Location);

  async reportPrice(data: {
    product: string;
    category: string;
    reportedPrice: number;
    location: string;
    latitude: number;
    longitude: number;
    shopName?: string;
    description?: string;
    images?: string[];
    reportedBy: string;
  }) {
    // Calculate estimated fair price (simplified algorithm)
    const estimatedFairPrice = this.calculateFairPrice(data.product, data.reportedPrice);
    const overchargePercentage = ((data.reportedPrice - estimatedFairPrice) / estimatedFairPrice) * 100;

    const price = this.priceRepository.create({
      ...data,
      estimatedFairPrice,
      overchargePercentage: Math.max(0, overchargePercentage),
      status: 'PENDING',
    });

    const savedPrice = await this.priceRepository.save(price);

    // Update location risk level
    await this.updateLocationRiskLevel(data.location);

    return savedPrice;
  }

  async getPricesByLocation(latitude: number, longitude: number, radiusKm: number = 5) {
    // Simple distance calculation (Haversine formula can be used for more accuracy)
    const radiusDegrees = radiusKm / 111; // 1 degree ≈ 111 km

    return this.priceRepository.find({
      where: {
        latitude: GreaterThanOrEqual(latitude - radiusDegrees) as any,
        longitude: GreaterThanOrEqual(longitude - radiusDegrees) as any,
        status: 'VERIFIED',
      },
      order: { createdAt: 'DESC' },
      relations: ['reportedBy'],
    });
  }

  async getPricesByProduct(productName: string, location?: string) {
    const query = this.priceRepository.createQueryBuilder('price')
      .where('LOWER(price.product) LIKE LOWER(:product)', { product: `%${productName}%` })
      .andWhere('price.status = :status', { status: 'VERIFIED' });

    if (location) {
      query.andWhere('price.location = :location', { location });
    }

    return query
      .orderBy('price.overchargePercentage', 'DESC')
      .addOrderBy('price.createdAt', 'DESC')
      .getMany();
  }

  async verifyPrice(priceId: string) {
    const price = await this.priceRepository.findOne({ where: { id: priceId } });

    if (!price) {
      throw new NotFoundError('Price');
    }

    price.status = 'VERIFIED';
    return this.priceRepository.save(price);
  }

  async getAveragePrice(product: string, location: string): Promise<number> {
    const result = await this.priceRepository
      .createQueryBuilder('price')
      .select('AVG(price.reportedPrice)', 'avg')
      .where('LOWER(price.product) LIKE LOWER(:product)', { product: `%${product}%` })
      .andWhere('price.location = :location', { location })
      .andWhere('price.status = :status', { status: 'VERIFIED' })
      .getRawOne();

    return result?.avg || 0;
  }

  private calculateFairPrice(product: string, reportedPrice: number): number {
    // Base fair price calculation (simplified)
    // In production, use historical data and market analysis
    const fairPriceMap: Record<string, number> = {
      'suitcase': 700,
      'luggage': 700,
      'bag': 300,
      'shirt': 200,
      'dress': 300,
      'shoes': 400,
    };

    const keyword = Object.keys(fairPriceMap).find(key =>
      product.toLowerCase().includes(key)
    );

    return keyword ? fairPriceMap[keyword] : reportedPrice * 0.5;
  }

  private async updateLocationRiskLevel(locationName: string) {
    let location = await this.locationRepository.findOne({
      where: { marketName: locationName }
    });

    if (!location) {
      return;
    }

    const avgOvercharge = await this.priceRepository
      .createQueryBuilder('price')
      .select('AVG(price.overchargePercentage)', 'avg')
      .where('price.location = :location', { location: locationName })
      .getRawOne();

    location.averageOverchargePercentage = avgOvercharge?.avg || 0;

    if (avgOvercharge?.avg > 100) {
      location.riskLevel = 'CRITICAL';
    } else if (avgOvercharge?.avg > 50) {
      location.riskLevel = 'HIGH';
    } else if (avgOvercharge?.avg > 25) {
      location.riskLevel = 'MEDIUM';
    } else {
      location.riskLevel = 'LOW';
    }

    await this.locationRepository.save(location);
  }
}
