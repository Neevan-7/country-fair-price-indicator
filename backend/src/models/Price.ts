import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('prices')
@Index(['product', 'location'])
@Index(['createdAt'])
export class Price {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  product: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  reportedPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedFairPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  overchargePercentage: number;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  shopName: string;

  @Column({ type: 'text', nullable: true })
  shopAddress: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'reportedBy' })
  reportedBy: User;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SCAM';

  @Column({ type: 'integer', default: 0 })
  helpfulCount: number;

  @Column({ type: 'integer', default: 0 })
  notHelpfulCount: number;

  @Column({ type: 'boolean', default: false })
  isFlagged: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
