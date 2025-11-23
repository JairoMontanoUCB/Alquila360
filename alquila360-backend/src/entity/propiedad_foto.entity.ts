import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Propiedad } from "./propiedad.entity";

@Entity("propiedad_fotos")
export class PropiedadFoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ruta: string;

  @ManyToOne(() => Propiedad, propiedad => propiedad.fotos)
  propiedad: Propiedad;
}
