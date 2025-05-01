declare module 'morgan' {
  import { RequestHandler } from 'express';
  
  function morgan(format: string | morgan.FormatFn, options?: morgan.Options): RequestHandler;
  
  namespace morgan {
    interface FormatFn {
      (tokens: TokenIndexer, req: any, res: any): string;
    }
    
    interface TokenIndexer {
      [key: string]: TokenCallback;
    }
    
    type TokenCallback = (req: any, res: any) => string;
    
    interface Options {
      buffer?: boolean;
      immediate?: boolean;
      skip?: (req: any, res: any) => boolean;
      stream?: NodeJS.WritableStream | { write: (str: string) => void };
    }
  }
  
  export = morgan;
} 