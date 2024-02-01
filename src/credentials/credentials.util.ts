import { SecurityService } from '../utils/security.service';
import { Credential } from './credential.entity';

export class CredentialsUtil {
  constructor(private readonly securityServiceUtil: SecurityService) {}

  protected async encryptCredential(credential: Credential) {
    const [
      encryptedAccountNumber,
      encryptedBearer,
      encryptedClientId,
      encryptedClientSecret,
      encryptedPassword,
      // encryptedUsername,
    ] = await Promise.all([
      this.securityServiceUtil.encryptWord(credential.accountNumber),
      this.securityServiceUtil.encryptWord(credential.bearer),
      this.securityServiceUtil.encryptWord(credential.clientId),
      this.securityServiceUtil.encryptWord(credential.clientSecret),
      this.securityServiceUtil.encryptWord(credential.password),
      // this.encryptWord(credential.username),
    ]);
    credential.accountNumber = encryptedAccountNumber;
    credential.bearer = encryptedBearer;
    credential.clientId = encryptedClientId;
    credential.clientSecret = encryptedClientSecret;
    credential.password = encryptedPassword;
    // credential.username = encryptedUsername;
  }

  protected async decryptCredential(credential: Credential) {
    const [
      accountNumber, //
      bearer,
      clientId,
      clientSecret,
      password,
      // username, //
    ] = await Promise.all([
      this.securityServiceUtil.decryptWord(credential.accountNumber), //
      this.securityServiceUtil.decryptWord(credential.bearer),
      this.securityServiceUtil.decryptWord(credential.clientId),
      this.securityServiceUtil.decryptWord(credential.clientSecret),
      this.securityServiceUtil.decryptWord(credential.password),
      // this.decryptWord(credential.username), //
    ]);
    credential.accountNumber = accountNumber; //
    credential.bearer = bearer;
    credential.clientId = clientId;
    credential.clientSecret = clientSecret;
    credential.password = password;
    // credential.username = username; //
  }

  protected async decryptCredentials(credentials: Credential[]) {
    await Promise.all(
      credentials.map((credential) => this.decryptCredential(credential)),
    );
  }
}
