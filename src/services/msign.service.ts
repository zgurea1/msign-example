import { createClientAsync, ClientSSLSecurity } from 'soap';
import { HttpException } from '@exceptions/HttpException';
import { pkiCert, privateKey, WSDL_URL } from '@config';
import { isEmpty } from '@utils/util';
import https from 'https';
import {
  TClient,
  TSignRequest,
  TSignResponse,
  TGetSignResponse,
  TGetSignResponseResult,
  TVerifySignResponse,
  TVerifySignRequst,
} from '@interfaces/msign';
class MsignService {
  private pkiCert = pkiCert;
  private privateKey = privateKey;

  /**
   * Construct a Promise<Client> with the given WSDL file or url.
   * @param {string} wsldUrl : A HTTP/HTTPS URL or a local filesystem path.
   * @param {Object} options : See soap.createClient(url[, options], callback) for a description.
   * @param {cert} privateKey : Private key
   * @param {cert} pkiCert : Private cert
   * @returns {Promise<Client>}
   */

  private async createSecureSoapClient(): Promise<any> {
    try {
      const client = await createClientAsync(WSDL_URL, {
        wsdl_options: {
          httpsAgent: new https.Agent({
            keepAlive: true,
            cert: this.pkiCert,
            key: this.privateKey,
          }),
        },
      });

      const description = client.describe();
      // console.log(description.MSignService.BasicHttpBinding_IMSign.VerifySignatures.input.request.Contents);

      // console.log(description.MSignService.BasicHttpBinding_IMSign.GetSignResponse);
      // console.log(description.MSignService.BasicHttpBinding_IMSign.VerifySignatures.input.request.Contents);
      // console.log(description.MSignService.BasicHttpBinding_IMSign.PostSignRequest.input.request);
      client.setSecurity(new ClientSSLSecurity(this.privateKey, this.pkiCert, {}));

      return client;
    } catch (error) {
      throw new HttpException(500, 'An error has occurred creating SOAP client');
    }
  }

  /**
   * Create request to imsign to sign pdf or hash content
   * @param {Object} request : Request object for sign input (see schema validation)
   * @returns {Promise}
   */
  public async postSignRequest({ request }: TSignRequest): Promise<TSignResponse> {
    try {
      if (isEmpty(request)) throw new HttpException(400, 'request is empty');

      const client: TClient = await this.createSecureSoapClient();

      const result = await client.PostSignRequestAsync({ request });

      return result;
    } catch (error) {
      console.error(error);

      throw new HttpException(400, 'An error has occurred singing method');
    }
  }
  /**
   * Create request to imsign to get status of sign content
   * @param {Object} request : Request object to get status of sign (see schema validation)
   * @returns {Promise}
   */
  public async getSignRequest(request: TGetSignResponse): Promise<TGetSignResponseResult> {
    try {
      if (isEmpty(request)) throw new HttpException(400, 'request is empty');
      const client = await this.createSecureSoapClient();

      const result: TGetSignResponseResult[] = await client.GetSignResponseAsync(request);

      return result[0];
    } catch (error) {
      throw new HttpException(400, 'An error has occurred signing status method');
    }
  }

  /**
   * Create request to imsign to verify pdf or hash content
   * @param {Object} request : Request object for verify input (see schema validation)
   * @returns {Promise}
   */
  public async verifySignRequest(request: TVerifySignRequst): Promise<TVerifySignResponse> {
    try {
      if (isEmpty(request)) throw new HttpException(400, 'request is empty');

      const client = await this.createSecureSoapClient();

      const result: TVerifySignResponse[] = await client.VerifySignaturesAsync({ request });

      return result[0];
    } catch (error) {
      throw new HttpException(400, 'An error has occurred verify singing method');
    }
  }
}

export default MsignService;
