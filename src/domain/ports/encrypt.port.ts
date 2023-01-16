export const EncryptionPortInjectorName = 'EncryptionPortInjectorName';
export interface EncryptionPort {
  hash(value: string): Promise<string>;
  compare(data: string, encrypted: string): Promise<boolean>;
}
