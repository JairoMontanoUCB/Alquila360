import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Propiedad } from "./propiedad.entity";
import { Contrato } from "./contrato.entity";

@Entity("expensas")
export class Expensa {

  @PrimaryGeneratedColumn({ name: "id_expensa" })
  id: number;

  @ManyToOne(() => Propiedad, propiedad => propiedad.expensas)
  propiedad: Propiedad;

  @ManyToOne(() => Contrato, contrato => contrato.expensas)
  contrato: Contrato;

  @Column()
  tipo_servicio: string;

  @Column({ type: "text", nullable: true })
  descripcion: string;

  @Column({ type: "decimal" })
  monto: number;

  @Column({ type: "date" })
  fecha_registro: Date;

  @Column({ nullable: true })
  comprobante_pdf: string;
}
