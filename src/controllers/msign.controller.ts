import { type NextFunction, Request, Response } from 'express';
import AppController from '@controllers/app.controller';
import { pdfBuffer, pdfBufferSigned } from '@config';
import { TSignRequest, TGetSignRequest, TVerifySignRequst } from '@interfaces/msign';
class MsignController extends AppController {
  public signRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request: TSignRequest = {
        ContentType: 'Pdf',
        Contents: {
          SignContent: [
            {
              Content: Buffer.from(pdfBuffer).toString('base64'),
            },
          ],
        },
        ShortContentDescription: 'Cerere',
      };

      const { PostSignRequestResult } = await this.msignService.postSignRequest(request);

      return res.status(200).json({
        success: true,
        payload: PostSignRequestResult,
        message: 'OK',
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request: TVerifySignRequst = {
        Contents: {
          VerificationContent: [
            { Signature: Buffer.from(pdfBufferSigned).toString('base64') },
            { Signature: Buffer.from(pdfBuffer).toString('base64') },
          ],
        },
        SignedContentType: 'Pdf',
      };

      const { VerifySignaturesResult } = await this.msignService.verifySignRequest(request);

      return res.status(200).json({
        success: true,
        payload: VerifySignaturesResult.Results.VerificationResult,
        message: 'OK',
      });
    } catch (error) {
      next(error);
    }
  };

  public getStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const request: TGetSignRequest = {
        requestID: id,
      };

      const { GetSignResponseResult } = await this.msignService.getSignRequest(request);

      return res.status(200).json({
        success: true,
        payload: GetSignResponseResult.Status,
        message: 'OK',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default MsignController;
