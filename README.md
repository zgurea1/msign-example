# MSign-Example

<summary>Assuming you have been through the circles of bureaucratic hell and you got your certificates , if not here is official guide (https://mpass.gov.md/info/procedure). Oky lets gooooo!</summary>

<summary>MSign uses a SOAP server, you will need to create a SOAP client to access the methods. I will explain 3 main methods.</summary>

```typescript
const client = await createClientAsync(WSDL_URL, {
  wsdl_options: {
    httpsAgent: new https.Agent({
      keepAlive: true,
      cert: this.pkiCert,
      key: this.privateKey,
    }),
  },
});

client.setSecurity(new ClientSSLSecurity(this.privateKey, this.pkiCert, {}));
```

# Sign documents

```typescript
const request = {
  ContentType: 'Pdf',
  Contents: {
    SignContent: [
      {
        Content: Buffer,
      },
    ],
  },
  ShortContentDescription: 'Cerere',
};

const [result] = await client.PostSignRequestAsync({ request });
```

# Sign status

```typescript
const request = {
  Contents: {
    VerificationContent: [{ Signature: Buffer }, { Signature: Buffer }],
  },
  SignedContentType: 'Pdf',
};
const [result] = await client.GetSignResponseAsync(request);
```

# Verify Sign

```typescript
const request: TGetSignRequest = {
  requestID: id,
};
const [result] = await client.VerifySignaturesAsync({ request });
```
