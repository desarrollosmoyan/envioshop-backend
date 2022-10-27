import { Router } from 'express';
import { getURLS, updateURLS } from './settings.controller';

const settingsRouter = Router();

settingsRouter.get('/', getURLS);
settingsRouter.put('/', updateURLS);

export default settingsRouter;
