import { Entity, Column, OneToOne, JoinColumn} from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { User } from "./user.entity";

@Entity('student_profiles')
export class StudentProfile extends BaseEntity {
    @Column()
    institution!: string;

    @Column()
    department!: string;

    @Column()
    semester!: string;

    @Column({ nullable: true, type: 'float' })
    cgpa?: number;

    @Column({ nullable: true })
    graduationYear?: number;

    @Column({ nullable: true, type: 'text' })
    skills?: string;

    @Column({ nullable: true, type: 'text' })
    interestedResearchFields?: string;

    @OneToOne(() => User)
    @JoinColumn()
    user!: User;

}