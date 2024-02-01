import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  CREDENTIALS_IV,
  CREDENTIALS_PASSWORD,
  CREDENTIALS_SALT,
} from '../config/config.constant';

const ALGORITHM = 'aes-256-ctr';
const BASE64 = 'base64';
const BASE64URL = 'base64url';
const HEX = 'hex';

@Injectable()
export class SecurityService {
  constructor(private readonly configService: ConfigService) {}

  async encryptWord(word: string) {
    if (!word) return null;
    const { iv, key } = await this.cryptConstants();
    const cipher = createCipheriv(ALGORITHM, key, iv);
    const encryptedText = Buffer.concat([cipher.update(word), cipher.final()]);
    return encryptedText.toString(BASE64);
  }

  async encryptWordForURL(word: string) {
    if (!word) return null;
    const { iv, key } = await this.cryptConstants();
    const cipher = createCipheriv(ALGORITHM, key, iv);
    const encryptedText = Buffer.concat([cipher.update(word), cipher.final()]);
    return encryptedText.toString(BASE64URL);
  }

  async decryptWord(encryptedWord: string) {
    if (!encryptedWord) return null;
    const { iv, key } = await this.cryptConstants();
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(encryptedWord, BASE64)),
      decipher.final(),
    ]);
    return decryptedText.toString();
  }

  async decryptWordForURL(encryptedWord: string) {
    if (!encryptedWord) return null;
    const { iv, key } = await this.cryptConstants();
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(encryptedWord, BASE64URL)),
      decipher.final(),
    ]);
    return decryptedText.toString();
  }

  private async cryptConstants() {
    const iv = Buffer.from(`${this.configService.get(CREDENTIALS_IV)}`, HEX);
    const key = (await promisify(scrypt)(
      `${this.configService.get(CREDENTIALS_PASSWORD)}`,
      `${this.configService.get(CREDENTIALS_SALT)}`,
      32,
    )) as Buffer;
    return { iv, key };
  }
}
