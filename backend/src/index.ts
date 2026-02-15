import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`➡️  Server running on port ${PORT}`);
});
