import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retryable: boolean;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    retryable: false,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiFunction(...args);
        
        if (response.error) {
          setState({
            data: null,
            loading: false,
            error: response.error,
            retryable: response.retryable || false,
          });
          
          if (options.onError) {
            options.onError(response.error);
          }
          
          logger.warn('API request failed:', { error: response.error });
        } else if (response.data) {
          setState({
            data: response.data,
            loading: false,
            error: null,
            retryable: false,
          });
          
          if (options.onSuccess) {
            options.onSuccess(response.data);
          }
          
          logger.info('API request succeeded');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          retryable: true,
        });
        
        if (options.onError) {
          options.onError(errorMessage);
        }
        
        logger.error('API request exception:', { error });
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      retryable: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
} 