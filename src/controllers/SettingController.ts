import { Router } from "express";
import { getRepository } from "typeorm";
import { Settings } from "../model/Settings";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Token } from "../model/Token";
import { User } from "../model/User";

const settingRouter = Router();

settingRouter.post("/email-notification", (req, res) => {});

settingRouter.post("/push-notification", (req, res) => {});

settingRouter.post("/my-settings", async (req, res) => {
  const userToken = req.header("Authorization")?.replace("Bearer ", "");
  const { email_notification, push_notification } = req.body;
  if (email_notification === undefined || push_notification === undefined) {
    return res.status(400).send({
      status: false,
      message: "Fields are required",
    });
  }

  const decoded = jwt.verify(`${userToken}`, "your_jwt_secret");
  const userId = Number((decoded as JwtPayload).userId);

  const settingRepository = getRepository(Settings);
  const existingUser = await settingRepository.findOne({
    where: { userId: userId },
  });

  if (existingUser) {
    return res.status(400).send({
      status: false,
      message: "Settings has already been setup",
    });
  }

  const mySetting = new Settings();

  mySetting.email_notification = email_notification;
  mySetting.push_notification = push_notification;
  mySetting.userId = userId;

  await settingRepository.save(mySetting);

  res.json({ status: true, message: "Setting saved successfully" });
});

settingRouter.get("/my-settings", async (req, res) => {
  const userToken = req.header("Authorization")?.replace("Bearer ", "");

  const decoded = jwt.verify(`${userToken}`, "your_jwt_secret");
  const userId = Number((decoded as JwtPayload).userId);

  const settingRepository = getRepository(Settings);
  const existingUser = await settingRepository.findOne({
    where: { userId: userId },
  });

  if (existingUser) {
    return res.json({
      status: true,
      data: existingUser,
    });
  } else {
    return res
      .status(400)
      .send({ status: false, message: "Something went wrong" });
  }
});


settingRouter.put("/my-settings", async (req, res) => {
  const userToken = req.header("Authorization")?.replace("Bearer ", "");
  const { email_notification, push_notification } = req.body;
  if (email_notification === undefined || push_notification === undefined) {
    return res.status(400).send({
      status: false,
      message: "Fields are required",
    });
  }

  const decoded = jwt.verify(`${userToken}`, "your_jwt_secret");
  const userId = Number((decoded as JwtPayload).userId);

  const settingRepository = getRepository(Settings);
  let userSettings = await settingRepository.findOne({
    where: { userId: userId },
  });


  if (!userSettings) {
    // If settings do not exist for the user, create a new one
    userSettings = new Settings();
    userSettings.userId = userId;
  }

  // Update the settings
  userSettings.email_notification = email_notification;
  userSettings.push_notification = push_notification;


  await settingRepository.save(userSettings);

  res.json({ status: true, message: "Setting updated successfully" });
});


export { settingRouter };
