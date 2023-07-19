# MSign-Example

<p>Assuming you have been through the circles of bureaucratic hell and you got your certificates here is an example how to integrate in our backend app.</p>

<p>If you are on start of your journey here is official guide what docs you need(https://mpass.gov.md/info/procedure). After that you can come back lets gooooo</p>

<p>MSign uses a SOAP server, you will need to create a SOAP client to access WSDL methods. To have access you will need to create a secure connection with the certs.</p>

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

<p>With client.describe() you can explore what methods you have and what are the inputs and outputs for them</p>

# Sign documents

<p>First at all the sign method only works with PDF and XML format. The request object thats bellow, its a example of the input for the method. Also you can add multiple files to sign. </p>

```typescript
const request = {
  ContentType: 'Pdf',
  Contents: {
    SignContent: [
      {
        Content: Buffer,
      },
      {
        Content: Buffer,
      },
    ],
  },
  ShortContentDescription: 'Cerere',
};

const [result] = await client.PostSignRequestAsync({ request });
```

<p>As the output you will get an id that you can use as parameter to msign webpage https://msign.staging.egov.md/${id} </p>

```json
{
  "success": true,
  "payload": "ac898a847610443281efb04400efce7c",
  "message": "OK"
}
```

<p>The url have some additional query parameters that can be added optionally</p>

<p>
<summary>ReturnUrl - The URL that will receive the result of transaction
signing</summary>
<summary>RelayState - Optional string that will be returned back unmodified
after signing</summary>
<summary>lang - Language to be used by MSign user interface.</summary>
</p>

![Sign](./images/sign.png)

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
