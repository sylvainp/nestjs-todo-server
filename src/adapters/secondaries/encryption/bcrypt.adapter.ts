import { EncryptionPort } from '../../../domain/ports/encrypt.port';
import * as bcrypt from 'bcrypt';
export class BcryptAdapter implements EncryptionPort {
  hash(value: string): Promise<string> {
    const round = 10;
    return bcrypt.hash(value, round);
  }
  compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
