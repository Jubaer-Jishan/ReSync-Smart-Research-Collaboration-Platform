import{Column, Entity} from 'typeorm';
import { BaseEntity } from './base.entity';

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
}