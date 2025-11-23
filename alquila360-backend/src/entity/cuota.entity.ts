import { Entity,OneToMany, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Contrato } from "./contrato.entity";
import { Pago } from "./pago.entity";

@Entity("cuotas")
export class Cuota {
  @PrimaryGeneratedColumn({ name: "cuota_id" })
  id: number;

  @ManyToOne(() => Contrato, contrato => contrato.cuotas)
  @JoinColumn({ name: "contrato_id" })
  contrato: Contrato;

  @Column()
  contrato_id: number;

  @OneToMany(() => Pago, pago => pago.cuota)
  pagos: Pago[];

  @Column({ unique: true })
  numero_referencia: string;

  @Column({ type: "date" })
  fecha_vencimiento: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  monto: number;

  @Column({
    type: "enum",
    enum: ["pendiente", "pagada", "vencida"],
    default: "pendiente"
  })
  estado: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @Column({ type: "date", nullable: true })
  fecha_pago: Date | null;

  //CAMBIOS PARA EXPENSAS
  @Column({
    type: "enum",
    enum: ["ALQUILER", "EXPENSA"], // Indica el tipo de obligación
    default: "ALQUILER"
  })
  tipo: string; 
}