import { Router } from "express";
import { Category } from "../model/Category";
import { getRepository } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

const categoryRouter = Router();


categoryRouter.post("/add-category", async (req, res)=>{
    const { name } = req.body;

    if (!name) {
        return res.status(400).send("Category name field required");
      }
    
      const categoryRepository = getRepository(Category);
      const existingCat = await categoryRepository.findOne({ where: { name } });
      console.log(existingCat);
      if (existingCat) {
        return res.status(400).send({
            status:false,
            message:"Category already exists"
        });
      }
    
    
      const category = new Category(name, uuidv4());
    
      await categoryRepository.save(category);
    
      res.status(201).send({
        status:true,
        message:"Category registered successfully"
      });
})



export { categoryRouter };