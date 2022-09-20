import { Franchise } from "@prisma/client";
export type SaleData = {
  franchiseId: string;
};
export type SaleUpdateData = {
  id: string;
  data: {
    franchise?: Franchise;
    franchiseId?: string;
  };
};
