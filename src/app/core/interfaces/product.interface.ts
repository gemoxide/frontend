import type { IMeta } from "../state/types/common";

export interface IProduct {
  id: number;
  type: string;
  attributes: IProductAttributes;
  relationships: IProductRelationships;
}

export interface IProductAttributes {
  name: string;
  description: string;
}

export interface IProductRelationships {
  categories: unknown;
}

export interface IProductList {
  data?: IProduct[];
  meta?: IMeta;
}

export interface IProductCreate {
  name: string;
  description: string;
}
