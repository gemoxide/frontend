import { put } from "redux-saga/effects";

export function* handleServerException(
  error: unknown,
  actionType: string,
  showToast: boolean = false
) {
  console.error("Server Exception:", error);

  if (showToast) {
    let message = "An error occurred";

    if (error && typeof error === "object") {
      const errorObj = error as Record<string, unknown>;
      if (errorObj.response && typeof errorObj.response === "object") {
        const response = errorObj.response as Record<string, unknown>;
        if (response.data && typeof response.data === "object") {
          const data = response.data as Record<string, unknown>;
          if (typeof data.message === "string") {
            message = data.message;
          }
        }
      } else if (typeof errorObj.message === "string") {
        message = errorObj.message;
      }
    }

    // You can add toast notification here if needed
    console.error(message);
  }

  yield put({ type: actionType });
}
