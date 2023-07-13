import axios from 'axios';
import { MSING_API } from '@config';
import { NextFunction, Request, Response } from 'express';
import AppController from '@controllers/app.controller';
import { pdfBuffer, pdfBufferSigned } from '@config';
import { TSignRequest, TGetSignResponse, TVerifySignRequst } from '@interfaces/msign';
class MsignController extends AppController {
  public signRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, type } = req.body;

      const request: TSignRequest = {
        ContentType: 'Pdf',
        Contents: {
          SignContent: [
            {
              Content: Buffer.from(pdfBuffer).toString('base64'),
            },
            {
              Content: Buffer.from(pdfBuffer).toString('base64'),
            },
          ],
        },
        ShortContentDescription: name || 'Cerere',
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
      const { a } = req.body;

      const request: TVerifySignRequst = {
        Contents: {
          VerificationContent: [{ Signature: Buffer.from(pdfBufferSigned).toString('base64') }],
        },
        SignedContentType: 'Pdf',
      };

      const { VerifySignaturesResult } = await this.msignService.verifySignRequest(request);

      return res.status(200).json({
        success: true,
        payload: VerifySignaturesResult,
        message: 'OK',
      });
    } catch (error) {
      next(error);
    }
  };

  public getStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const request: TGetSignResponse = {
        requestID: id,
      };

      const { GetSignResponseResult } = await this.msignService.getSignRequest(request);
      console.log(GetSignResponseResult);

      return res.status(200).json({
        success: true,
        payload: GetSignResponseResult,
        message: 'OK',
      });
    } catch (error) {
      next(error);
    }
  };

  public getFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.body;
      const urlMsignUrl = `${MSING_API}/api/direct/GetContentsIDs?id=${id}`;

      const { data } = await axios({
        method: 'GET',
        url: urlMsignUrl,
      });

      const fileUrl = `${MSING_API}/api/direct/GetFile?id=${data[0]}&isContent=false`;

      const { data: FileData } = await axios({
        method: 'GET',
        url: fileUrl,
        responseType: 'arraybuffer',
      });

      return res.status(200).send(Buffer.from(FileData, 'base64'));
    } catch (error) {
      next(error);
    }
  };
}

export default MsignController;
