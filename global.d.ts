import "jest-extended";

declare global {
  namespace Express {
    interface Request {
      user: CurrentUser;
    }
  }
}
