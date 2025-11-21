import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity("user_ratings")
export class UserRating {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  estrellas: number;

  @Column({ type: "text", nullable: true })
  comentario: string;

  @ManyToOne(() => User, user => user.calificacionesRecibidas)
  usuario: User;

  @ManyToOne(() => User, user => user.calificacionesRealizadas)
  autor: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha: Date;
}
