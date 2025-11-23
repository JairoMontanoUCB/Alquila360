import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Propiedad } from "./propiedad.entity";
import { User } from "./user.entity";

@Entity("property_ratings")
export class PropertyRating {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  estrellas: number;

  @Column({ type: "text", nullable: true })
  comentario: string | null;

  @ManyToOne(() => Propiedad, propiedad => propiedad.calificaciones)
  propiedad: Propiedad;

  @ManyToOne(() => User, user => user.propertyRatings)
  autor: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha: Date;
}
