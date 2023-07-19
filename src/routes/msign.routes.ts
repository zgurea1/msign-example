import MsignController from '@/controllers/msign.controller';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';

class MsignRoute implements Routes {
  public path = '/msign';
  public router: Router = Router();
  public msignController = new MsignController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/sign`, this.msignController.signRequest);
    this.router.get(`${this.path}/status/:id`, this.msignController.getStatus);
    this.router.get(`${this.path}/verifysign`, this.msignController.verifyRequest);
  }
}

export default MsignRoute;
