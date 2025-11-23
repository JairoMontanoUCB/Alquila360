import { User } from "./user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";


@Entity("reportes")
export class Reportes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: "usuario_id" })
  usuario: User;

  @Column({ type: "text" })
  motivo: string;

  @Column({ type: "text", nullable: true })
  descripcion: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_reporte: Date;
}