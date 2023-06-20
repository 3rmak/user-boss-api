import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../../role/entity/role.entity';
import { UserResponseDto } from '../dto/user-response.dto';

export const UserPasswordRegex = new RegExp('[a-zA-z0-9]{8,64}');

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  public email: string;

  @Column({ type: 'varchar', nullable: false })
  public password: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  public fullName: string;

  @Column({ type: 'uuid', nullable: false })
  public roleId: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn()
  public role: Role;

  @Column({ type: 'uuid', nullable: true, default: null })
  public bossId: string;

  @ManyToOne(() => User, (boss) => boss.subordinates)
  @JoinColumn()
  public boss: User;

  @OneToMany(() => User, (subordinate) => subordinate.boss)
  public subordinates: User[];

  public toDto(): UserResponseDto {
    return new UserResponseDto(this);
  }
}
