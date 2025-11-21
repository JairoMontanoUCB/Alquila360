import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Propiedad } from "./propiedad.entity";
import { User } from "./user.entity";
import { Pago } from "./pago.entity";
import { Ticket } from "./ticket.entity";
import { Exclude } from 'class-transformer';

@Entity("contratos")
export class Contrato {
  @PrimaryGeneratedColumn({ name: "contrato_id" })
  id: number;
 
  @ManyToOne(() => Propiedad, propiedad => propiedad.contratos)
  @JoinColumn({ name: "id_propiedad" })
  propiedad: Propiedad;
  
  @Column()
  id_propiedad: number;

  @ManyToOne(() => User, user => user.contratos)
  inquilino: User;

  @Column({ type: "date" })
  fecha_inicio: Date;

  @Column({ type: "date", nullable: true })
  fecha_fin: Date;

  @Column({ type: "decimal" })
  monto_mensual: number;

  @Column({ type: "decimal", nullable: true })
  garantia: number;

  @Column({ nullable: true })
  archivo_pdf: string;

  @OneToMany(() => Pago, pago => pago.contrato)
  pagos: Pago[];

  @Column({
    type: "enum",
    enum: ["activo", "finalizado", "cancelado"],
    default: "pendiente",
  })
  estado: string;
}
