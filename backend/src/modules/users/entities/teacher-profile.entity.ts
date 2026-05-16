import{Column, Entity, JoinColumn, OneToOne} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';
import Joi from 'joi';

@Entity('teacher_profiles')
export class TeacherProfile extends BaseEntity {
    @Column()
    institution!: string;

    @Column()
    department!: string;

    @Column()
    designation!: string;

    @Column({ nullable: true })
    officeLocation?: string;

    @Column({ nullable: true })
    yearsOfExperience?: number;

    @Column({ nullable: true, type: 'text' })
    specialization?: string;

    @Column({ nullable: true, type: 'text' })
    currentResearchArea?: string;

    @Column({ nullable: true })
    googleScholarProfile?: string;

    @Column({ nullable: true })
    researchGateProfile?: string;

    @Column({ nullable: true })
    orcidId?: string;

    @Column({ nullable: true })
    totalPublications?: number;

    @Column({ nullable: true })
    hIndex?: number;

    // Relation with User

    @OneToOne(() => User)
    @JoinColumn()
    user!: User;
}