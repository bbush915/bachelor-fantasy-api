import { sign, verify } from "jsonwebtoken";

import configuration from "configuration";

export function encode(payload: any): string {
  return sign(payload, configuration.jwt.secret!, {
    expiresIn: 7 * 24 * 60 * 60,
  });
}

export function decode(token: string) {
  return verify(token, configuration.jwt.secret!);
}
