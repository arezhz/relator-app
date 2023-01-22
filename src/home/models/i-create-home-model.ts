import { HomePropertyType } from '@prisma/client';

export interface ICreateHomeModel {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: HomePropertyType;
  images: { url: string }[];
}
