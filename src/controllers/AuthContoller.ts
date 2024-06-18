import { Router } from "express";
import { getRepository } from "typeorm";
import { User } from "../model/User";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Token } from "../model/Token";
// import { Token } from "../model/Token";
import { verifyToken } from "../middleware/TokenUtil";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  const userRepository = getRepository(User);
  const existingUser = await userRepository.findOne({ where: { email } });
  console.log(existingUser);
  if (existingUser) {
    return res.status(400).send({
      status: false,
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User(name, email, hashedPassword);

  await userRepository.save(user);

  res.status(201).send({
    status: true,
    message: "User registered successfully",
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      status: false,
      message: "Missing required fields",
    });
  }

  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    return res.status(400).send({
      status: false,
      message: "Invalid email or password",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).send({
      status: false,
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign({ userId: user.id }, "your_jwt_secret", {
    expiresIn: "1h",
  });

  const tokenRepository = getRepository(Token);
  const userToken = new Token();
  userToken.userId = user.id!;
  userToken.token = token;

  await tokenRepository.save(userToken);

  res.json({
    status: true,
    accessToken: token,
    data: {
      name: user.name,
      email: user.email,
    },
  });
});

authRouter.put("/update", verifyToken, async (req, res) => {
  const userToken = req.header("Authorization")?.replace("Bearer ", "");

  const { email, password } = req.body;

  const decoded = jwt.verify(`${userToken}`, "your_jwt_secret");
  const userId = Number((decoded as JwtPayload).userId);

  if (!email && !password) {
    return res.status(400).send({
      status: false,
      message: "No data to update",
    });
  }

  const userRepository = getRepository(User);
  const user = await userRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).send({
      status: false,
      message: "User not found",
    });
  }

  if (email) {
    user.email = email;
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await userRepository.save(user);
  res.send({ status: true, message: "User updated successfully" });
});

export { authRouter };
