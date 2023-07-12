import App from './app';
import MsignRoute from '@routes/msign.routes';

const app = new App([new MsignRoute()]);

app.listen();
