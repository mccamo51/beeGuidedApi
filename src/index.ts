import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { authRouter } from './controllers/AuthContoller';
import { User } from './model/User';
import { createConnection, getRepository } from 'typeorm';
import { categoryRouter } from './controllers/CategoryController';
import { settingRouter } from './controllers/SettingController';
import { verifyToken } from './middleware/TokenUtil';



const app = express();
const port = 4000;

app.use(express.json());
app.use('/auth', authRouter);

app.use("/category", categoryRouter)
app.use("/settings",verifyToken, settingRouter)

app.get('/users', async (req, res) => {
  try {
    const users = await getRepository(User).find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "BeeGuided",
    synchronize: true,
    logging: false,
    entities: [
      'src/model/**/*.ts'
    ],
    migrations: [
      'src/migration/**/*.ts'
    ],
    subscribers: [
      'src/subscriber/**/*.ts'
    ],
}).then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }).catch(error => console.log(error));


