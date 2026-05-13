import { Entity,Column } from "typeorm";
import { BaseEntity } from "./base.entity";
import { VisibilityType } from "src/modules/users/enums/visibility-type.enum";

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
}