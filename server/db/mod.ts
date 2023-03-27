// import {
//   DataTypes,
//   Database,
//   Model,
//   PostgresConnector,
// } from "https://deno.land/x/denodb@v1.4.0/mod.ts";

// const connection = new PostgresConnector({
//   host: "db.jybazbhxntqpojrmhgnc.supabase.co",
//   port: 5432,
//   username: "postgres",
//   password: "Sr9EjRpN5vHUR1MG",
//   database: "postgres",
// });

// const db = new Database(connection);

// class Flight extends Model {
//   static table = "flights";
//   static timestamps = true;

//   static fields = {
//     id: { primaryKey: true, autoIncrement: true },
//     departure: DataTypes.STRING,
//     destination: DataTypes.STRING,
//     flightDuration: DataTypes.FLOAT,
//   };

//   static defaults = {
//     flightDuration: 2.5,
//   };
// }

// db.link([Flight]);

// await db.sync({ drop: true });

// const flight = new Flight();
// flight.departure = "London";
// flight.destination = "San Francisco";
// await flight.save();
