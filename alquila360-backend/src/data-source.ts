import { DataSource } from "typeorm";
import { User } from "./entity/user.entity";
import { Propiedad } from "./entity/propiedad.entity";
import { Contrato } from "./entity/contrato.entity";
import { Pago } from "./entity/pago.entity";
import { Ticket } from "./entity/ticket.entity";
import { PropiedadFoto } from "./entity/propiedad_foto.entity";
import { TicketFoto } from "./entity/ticket_foto.entity";
<<<<<<< HEAD
import { Expensa } from "./entity/expensa.entity";
=======
import { UserRating } from "./entity/user_rating.entity";  // ← FALTA ESTA IMPORTACIÓN
>>>>>>> origin/ticketPrueba

import "reflect-metadata";

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "alquila360_admin",
    password: "123456789",
    database: "alquila360",
<<<<<<< HEAD
    entities: [User,Propiedad,Contrato,Pago,Ticket,PropiedadFoto,TicketFoto,Expensa],
=======
    entities: [
        User,
        Propiedad,
        Contrato,
        Pago,
        Ticket,
        PropiedadFoto,
        TicketFoto,
        UserRating,   // ← AGREGA ESTO
    ],
>>>>>>> origin/ticketPrueba
    synchronize: true,
    logging: true,
});

export default AppDataSource;
