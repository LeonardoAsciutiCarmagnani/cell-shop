import type { NextFunction, Request, Response } from 'express';

export function Logger(req: Request, res: Response, next: NextFunction) {
  const json = res.json.bind(res);

  res.json = ((body: unknown) => {
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      responseCode: res.statusCode,
    };

    if (res.statusCode >= 400) {
      console.error(JSON.stringify(log));
    } else {
      console.log(JSON.stringify(log));
    }

    return json(body);
  }) as Response['json'];

  next();
}
