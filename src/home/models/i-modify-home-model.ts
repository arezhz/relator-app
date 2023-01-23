import { HomePropertyType } from '@prisma/client';

export interface IModifyHomeModel {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: HomePropertyType;
}
