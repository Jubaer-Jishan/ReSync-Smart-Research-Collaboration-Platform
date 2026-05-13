import { Entity,Column,ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { VisibilityType } from "src/modules/users/enums/visibility-type.enum";
import { User } from "src/modules/users/entities/user.entity";

@Entity('groups')
export class Group extends BaseEntity {
    @Column()
    groupName!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ nullable: true })
    groupImage?: string;

    @Column()
    researchField!: string;

    @Column({
        type: 'enum',
        enum: VisibilityType,
        default: VisibilityType.PUBLIC,
    })
    visibility!: VisibilityType;

    @Column({ default: 50 })
    maxMembers!: number;

    @Column({ nullable: true })
    institution?: string;

    //Relation with User

    @ManyToMany(() => User, (user) => user.groups)
    @JoinTable()
    members?: User[];
}