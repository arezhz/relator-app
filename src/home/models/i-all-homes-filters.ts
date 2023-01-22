import { HomePropertyType } from '@prisma/client';
export interface IAllHomesFilters {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  property_type?: HomePropertyType;
}