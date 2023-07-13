type SignContent = {
  Content: Buffer | string;
};

type Contents = {
  SignContent: SignContent[];
};

export type TSignRequest = {
  request: {
    ContentType: string | 'pdf' | 'xml';
    Contents: Contents;
    ShortContentDescription: string | 'Cerere';
  };
};

export type TSignResponse = {
  PostSignRequestResult: string;
};

export type TGetSignResponse = {
  requestID: string;
  language?: string | 'ro';
};

export type TGetSignResponseResult = {
  GetSignResponseResult: {
    Results: {
      SignResult: string[];
    };
    Status: string | 'Pending' | 'Success' | 'Failure' | 'Expired';
  };
};

type VetifyContent = {
  Signature?: Buffer | string;
  Content?: Buffer | string;
  CorrelationID?: string;
};
type VerificationContent = {
  VerificationContent: VetifyContent[];
};

export type TVerifySignRequst = {
  Contents: VerificationContent;
  Language?: string | 'ro';
  SignedContentType?: string | 'Hash' | 'Pdf';
};

export type TVerifySignResponse = {
  VerifySignaturesResult: VerifySignaturesResult;
};

type VerifySignaturesResult = {
  Results: Results;
};

type Results = {
  VerificationResult: VerificationResult[];
};

type VerificationResult = {
  Certificates: Certificates;
  Message: string;
  SignaturesValid: boolean;
};

type Certificates = {
  VerificationCertificate: VerificationCertificate[];
};

type VerificationCertificate = {
  Certificate: string;
  SignatureValid: boolean;
  SignedAt: Date;
  Subject: string;
};

export type TClient = {
  PostSignRequestAsync(request: TSignRequest): TSignResponse;
  GetSignResponseAsync(request: TGetSignResponse): TGetSignResponseResult;
  VerifySignaturesAsync(request: TVerifySignRequst): TVerifySignResponse;
};
