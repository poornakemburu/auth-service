import { Response } from 'express';

export const sendResponse = (res: Response, statusCode: number, data: object | string, success = true) => {
  return res.status(statusCode).json({
    success,
    data,
    timestamp: new Date().toISOString()
  });
};

export const sendErrorResponse = (res: Response, statusCode: number, message: string, errors: object | null = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

// Keep the old functions for backward compatibility
export const createResponse = (statusCode: number, data: object | string, success = true) => {
  return {
    success,
    data,
    timestamp: new Date().toISOString()
  };
};

export const createErrorResponse = (statusCode: number, message: string, errors: object | null = null) => {
  return {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  };
};
  