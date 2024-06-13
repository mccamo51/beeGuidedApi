import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../model/User"

//  const AppDataSource = new DataSource({
//     type: "postgres",
//     host: "localhost",
//     port: 5432,
//     username: "postgres",
//     password: "admin",
//     database: "AuctionEcom",
//     entities: [User],
//     synchronize: true,
//     logging: false,
// })

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
// AppDataSource.initialize()
//     .then(() => {
//         console.log("dfghjklkj")
//         // here you can start to work with your database
//     })
//     .catch((error) => console.log(error))