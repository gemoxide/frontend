import type { ProductState } from "../types/product";
import { createSlice } from "@reduxjs/toolkit";
import { bindActionCreators } from "redux";
import type { Dispatch } from "redux";

const initialState: ProductState = {
  getProducts: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  getProduct: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  createProduct: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  updateProduct: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
  deleteProduct: {
    data: undefined,
    loading: false,
    success: false,
    error: false,
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    getProducts(state) {
      state.getProducts = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    getProductsSuccess(state, actions) {
      state.getProducts = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    getProductsFailure(state) {
      state.getProducts = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },
    getProduct(state) {
      state.getProduct = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    getProductSuccess(state, actions) {
      state.getProduct = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    getProductFailure(state) {
      state.getProduct = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },
    createProduct(state) {
      state.createProduct = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    createProductSuccess(state, actions) {
      state.createProduct = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    createProductFailure(state) {
      state.createProduct = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },
    updateProduct(state) {
      state.updateProduct = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    updateProductSuccess(state, actions) {
      state.updateProduct = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    updateProductFailure(state) {
      state.updateProduct = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },
    deleteProduct(state) {
      state.deleteProduct = {
        data: undefined,
        loading: true,
        success: false,
        error: false,
      };
    },
    deleteProductSuccess(state, actions) {
      state.deleteProduct = {
        data: actions.payload,
        loading: false,
        success: true,
        error: false,
      };
    },
    deleteProductFailure(state) {
      state.deleteProduct = {
        data: undefined,
        loading: false,
        success: false,
        error: true,
      };
    },
  },
});

export const {
  getProducts,
  getProductsSuccess,
  getProductsFailure,
  getProduct,
  getProductSuccess,
  getProductFailure,
  createProduct,
  createProductSuccess,
  createProductFailure,
  updateProduct,
  updateProductSuccess,
  updateProductFailure,
  deleteProduct,
  deleteProductSuccess,
  deleteProductFailure,
} = productsSlice.actions;

export const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      getProducts,
      getProductsSuccess,
      getProductsFailure,
      getProduct,
      getProductSuccess,
      getProductFailure,
      createProduct,
      createProductSuccess,
      createProductFailure,
      updateProduct,
      updateProductSuccess,
      updateProductFailure,
      deleteProduct,
      deleteProductSuccess,
      deleteProductFailure,
    },
    dispatch
  );
};

export default productsSlice.reducer;
