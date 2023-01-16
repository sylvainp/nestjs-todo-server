import { EncryptionPort } from './encrypt.port';

export class EncryptMockAdapter implements EncryptionPort {
  hash(value: string): Promise<string> {
    return Promise.resolve(value);
  }

  compare(data: string, encrypted: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
