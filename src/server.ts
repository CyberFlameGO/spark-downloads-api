import { DataManager, TranslationManager } from './data';
import express, { Request, Response } from 'express';

import { DataRouter } from './routers/data-router';
import { TranslationRouter } from './routers/translation-router';
import cors from 'cors';
import morgan from 'morgan';
import pretty from './util/pretty';

export class MetadataHttpServer {
  express: express.Express;

  dataManager: DataManager;
  translationManager: TranslationManager;

  dataRouter: DataRouter;
  translationRouter: TranslationRouter;

  constructor() {
    this.express = express();
    this.configure();

    this.dataManager = new DataManager();
    this.translationManager = new TranslationManager(this.dataManager);

    this.dataRouter = new DataRouter(this.dataManager);
    this.translationRouter = new TranslationRouter(this.translationManager);

    this.setupRoutes();
  }

  configure() {
    this.express.use(morgan('dev'));
    this.express.use(pretty);
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cors());
    this.express.disable('x-powered-by');
  }

  setupRoutes() {
    this.express.use('/data', this.dataRouter.express);
    this.express.use('/translation', this.translationRouter.express);

    this.express.use(this.generic);
    this.express.use(this.errorHandler);
  }

  generic(req: Request, res: Response) {
    res.status(404).send('Endpoint not found');
  }

  errorHandler(err: any, req: Request, res: Response) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
  }
}
