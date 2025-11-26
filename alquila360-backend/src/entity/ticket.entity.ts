import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Propiedad } from "./propiedad.entity";
import { TicketFoto } from "./ticket_foto.entity";

@Entity("tickets")
export class Ticket {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  descripcion: string;

  @ManyToOne(() => User, user => user.tickets)
  @JoinColumn({ name: "usuario_id" })
  usuario: User;

  @ManyToOne(() => Propiedad, propiedad => propiedad.tickets)
  @JoinColumn({ name: "propiedad_id" })
  propiedad: Propiedad;

  @OneToMany(() => TicketFoto, foto => foto.ticket, { cascade: true })
  fotos: TicketFoto[];

  @Column({
    type: "enum",
    enum: ["baja", "media", "alta"],
    default: "baja"
  })
  prioridad: string;

  @Column({
    type: "enum",
    enum: ["pendiente", "proceso", "resuelto"],
    default: "pendiente"
  })
  estado: string;

  @Column({ type: "text", name: "tipo_problema", nullable: true })
  tipoProblema: string;

  @ManyToOne(() => User, user => user.ticketsAsignados, { nullable: true })
  @JoinColumn({ name: "tecnico_id" })
  tecnico: User | null;
}

