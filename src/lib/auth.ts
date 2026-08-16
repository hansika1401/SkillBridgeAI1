export type JwtPayload = { id: string; email: string };

export function signToken(_payload: JwtPayload, _expiresIn: string = '7d') {
  throw new Error('signToken not implemented: install and configure JWT library');
}

export function verifyToken(_token: string): JwtPayload | null {
  return null;
}

export async function hashPassword(_raw: string) {
  throw new Error('hashPassword not implemented: install and configure hashing library');
}

export async function comparePassword(_raw: string, _hashed: string) {
  return false;
}
