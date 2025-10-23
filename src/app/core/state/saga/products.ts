import { takeLatest, call, put } from "redux-saga/effects";
import {
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
} from "../reducer/products";
import {
  getProductsRequest,
  getProductRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
} from "../../services/auth/product.service";
import { handleServerException } from "../../services/utils/utils.service";
import type { AxiosResponse } from "axios";
import type { IProductCreate } from "../../interfaces/product.interface";

// Get Products Saga
function* getProductsSaga() {
  try {
    const { data }: AxiosResponse = yield call(getProductsRequest);
    yield put(getProductsSuccess(data));
  } catch (err: unknown) {
    yield call(handleServerException, err, getProductsFailure.type, true);
  }
}

// Get Product Saga
function* getProductSaga(action: { payload: number }) {
  try {
    const { data }: AxiosResponse = yield call(
      getProductRequest,
      action.payload
    );
    yield put(getProductSuccess(data));
  } catch (err: unknown) {
    yield call(handleServerException, err, getProductFailure.type, true);
  }
}

// Create Product Saga
function* createProductSaga(action: { payload: IProductCreate }) {
  try {
    const { data }: AxiosResponse = yield call(
      createProductRequest,
      action.payload
    );
    yield put(createProductSuccess(data));
  } catch (err: unknown) {
    yield call(handleServerException, err, createProductFailure.type, true);
  }
}

// Update Product Saga
function* updateProductSaga(action: {
  payload: { id: number; data: IProductCreate };
}) {
  try {
    const { data }: AxiosResponse = yield call(
      updateProductRequest,
      action.payload.id,
      action.payload.data
    );
    yield put(updateProductSuccess(data));
  } catch (err: unknown) {
    yield call(handleServerException, err, updateProductFailure.type, true);
  }
}

// Delete Product Saga
function* deleteProductSaga(action: { payload: number }) {
  try {
    const { data }: AxiosResponse = yield call(
      deleteProductRequest,
      action.payload
    );
    yield put(deleteProductSuccess(data));
  } catch (err: unknown) {
    yield call(handleServerException, err, deleteProductFailure.type, true);
  }
}

// Root Saga
export function* rootSaga() {
  yield takeLatest(getProducts.type, getProductsSaga);
  // @ts-expect-error - Redux Saga type compatibility issue
  yield takeLatest(getProduct.type, getProductSaga);
  // @ts-expect-error - Redux Saga type compatibility issue
  yield takeLatest(createProduct.type, createProductSaga);
  // @ts-expect-error - Redux Saga type compatibility issue
  yield takeLatest(updateProduct.type, updateProductSaga);
  // @ts-expect-error - Redux Saga type compatibility issue
  yield takeLatest(deleteProduct.type, deleteProductSaga);
}
