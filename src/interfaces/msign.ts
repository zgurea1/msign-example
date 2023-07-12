type Contents = {
  SignContent: SignContent[];
};

type SignContent = {
  Content: Buffer | string;
};

export type TSignRequest = {
  ContentType: string | 'pdf' | 'xml';
  Contents: Contents;
  ShortContentDescription: string | 'Cerere';
};

export type TSignResponse = {
  PostSignRequestResult: string;
};
