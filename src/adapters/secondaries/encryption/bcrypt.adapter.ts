import { EncryptionPort } from '../../../domain/ports/encrypt.port';
import * as bcrypt from 'bcrypt';
export class BcryptAdapter implements EncryptionPort {
  readonly round = 10;
  hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.round);
  }
  compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
