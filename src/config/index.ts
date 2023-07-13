import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const privateKey = readFileSync(join(__dirname, '/cert/key.pem'));
export const pkiCert = readFileSync(join(__dirname, '/cert/pki.pem'));
export const pdfBuffer = readFileSync(join(__dirname, '/cert/invoce-example.pdf'));
export const pdfBufferSigned = readFileSync(join(__dirname, '/cert/invoce-example.semnat.pdf'));

export const CREDENTIALS = process.env.CREDENTIALS == true;
export const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR, ORIGIN, WSDL_URL, FRONTEND_URL, MSING_API } = process.env;

export const corsOptions = {
  origin: (origin: string, callback: void) => {
    if (ORIGIN.split(', ').indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: CREDENTIALS,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST'],
  preflightContinue: false,
};
