import type {
  IProduct,
  IProductList,
} from "../../interfaces/product.interface";
import type { LoadingResult } from "./common";

export interface ProductState {
  getProducts: GetProducts;
  getProduct: GetProduct;
  createProduct: CreateProduct;
  updateProduct: UpdateProduct;
  deleteProduct: DeleteProduct;
}

export type GetProducts = LoadingResult & {
  data?: IProductList;
};

export type GetProduct = LoadingResult & {
  data?: IProduct;
};

export type CreateProduct = LoadingResult & {
  data?: IProduct;
};

export type UpdateProduct = LoadingResult & {
  data?: IProduct;
};

export type DeleteProduct = LoadingResult & {
  data?: boolean;
};
