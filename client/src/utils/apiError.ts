type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  const apiError = error as ApiErrorShape;
  return apiError?.response?.data?.message || apiError?.message || fallback;
}
