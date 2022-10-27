import { Request, Response } from 'express';
import { promises as FileSystem } from 'fs';
export const getURLS = async (req: Request, res: Response) => {
  const rawData = await FileSystem.readFile(
    './src/data/settings.json',
    'binary'
  );
  if (!rawData)
    return res.json({
      fedex: 'https://apis.fedex.com',
      dhl: 'https://express.api.dhl.com/mydhlapi/test',
      ups: 'https://wwwcie.ups.com',
    });
  const data = JSON.parse(rawData);
  return res.json(data);
};
export const updateURLS = async (req: Request, res: Response) => {
  const rawData = await FileSystem.readFile(
    './src/data/settings.json',
    'binary'
  );
  if (!rawData || !req.body)
    return res.json({
      fedex: 'https://apis.fedex.com',
      dhl: 'https://express.api.dhl.com/mydhlapi/test',
      ups: 'https://wwwcie.ups.com',
    });

  await FileSystem.writeFile(
    './src/data/settings.json',
    JSON.stringify(req.body)
  );
  return res.json(req.body);
};
