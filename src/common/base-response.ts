export class BaseResponse<T> {
  success: boolean;
  message: string;
  data: T | null;

  constructor(success: boolean, message: string, data: T | null = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static successResponse<T>(message: string, data: T): BaseResponse<T> {
    return new BaseResponse<T>(true, message, data);
  }

  static errorResponse<T>(
    message: string,
    data: T | null = null,
  ): BaseResponse<T> {
    return new BaseResponse<T>(false, message, data);
  }
}
