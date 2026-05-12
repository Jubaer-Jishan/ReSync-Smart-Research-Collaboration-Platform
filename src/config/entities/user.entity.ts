import { Entity,Column,Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import {Role} from "src/modules/users/enums/role.enum";

@Entity('users')
export class User extends BaseEntity {
    @Column()
    name!: string;

    @Column({ unique: true })
    @Index()
    email!: string;

    @Column()
    password!: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.RESEARCHER,
    })
    role!: Role;

    //Profile Information

    @Column({ nullable: true, type: 'text' })
        bio?: string;
    
    @Column({ nullable: true })
        profilePictureUrl?: string;

    @Column({ nullable: true })
    bannerImage?: string;

    @Column({ nullable: true })
    location?: string;

    @Column({ nullable: true })
    website?: string;

    @Column({ nullable: true })
    contactNumber?: string;

    // Social Links
    @Column({ nullable: true })
    githubProfile?: string;

    @Column({ nullable: true })
    linkedinProfile?: string;

    @Column({ nullable: true })
    twitterProfile?: string;

    @Column({ nullable: true })
    facebookProfile?: string;

    @Column({ nullable: true })
    orcidProfile?: string;

    @Column({ nullable: true })
    googleScholarProfile?: string;

    @Column({ nullable: true })
    researchGateProfile?: string;


    // Verification & Status
    @Column({ default: false })
    isEmailVerified!: boolean;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ default: false })
    isProfileComplete!: boolean;

    // Auth Related
    @Column({ nullable: true, type: 'text' })
    refreshToken?: string;

    @Column({ nullable: true })
    lastLoginAt?: Date;

    @Column({ nullable: true })
    passwordChangedAt?: Date;

    // Platform Stats
    @Column({ default: 0 })
    reputationPoints!: number;

    @Column({ default: 0 })
    followerCount!: number;

    @Column({ default: 0 })
    followingCount!: number;

    @Column({ default: 0 })
    totalPosts!: number;

}