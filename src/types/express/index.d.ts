declare namespace Express {
    export interface Request {
      user?: any; // Add the user property (it can be `any` or a custom type if you prefer)
    }
  }
  