import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../user/entity/user.entity';
import { RolesEnum } from './roles.enum';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ enum: RolesEnum, unique: true, nullable: false })
  public value: RolesEnum;

  @OneToMany(() => User, (user) => user.role)
  public users: User[];
}
