import { sign, verify } from "jsonwebtoken";

import configuration from "configuration";

export function encode(payload: any, expiresIn: number = 7 * 24 * 60 * 60): string {
  return sign(payload, configuration.jwt.secret!, {
    expiresIn,
  });
}

export function decode(token: string) {
  return verify(token, configuration.jwt.secret!);
}
