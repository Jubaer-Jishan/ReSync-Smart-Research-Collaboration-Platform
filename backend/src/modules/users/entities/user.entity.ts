import { Entity,Column,Index,OneToOne,ManyToMany, JoinColumn, OneToMany} from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import {Role} from "../enums/role.enum";
import { Department } from "../enums/department.enum";
import { StudentProfile } from "./student-profile.entity";
import { TeacherProfile } from "./teacher-profile.entity";
import { Group } from "../../groups/entities/group.entity";
import { ProjectMember } from "../../projects/entities/project-member.entity";
import { ResearchPostApplication } from "../../applications/entities/research-post-application.entity";
import { Follow } from './follow.entity';
import { TeamMember } from '../../teams/entities/team-member.entity';
import { Application } from '../../teams/entities/application.entity';
import { Invitation } from '../../teams/entities/invitation.entity';
import { Like } from '../../posts/entities/like.entity';
import { Comment } from '../../posts/entities/comment.entity';
import { Share } from '../../posts/entities/share.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column()
    name!: string;

    @Column()
    username!: string;

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

    @Column({ nullable: true })
    institution?: string;

    @Column({
      type: 'enum',
      enum: Department,
      nullable: true,
    })
    department?: Department;

    @Column({ nullable: true })
    phoneNumber?: string;

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

    @Column({ default: false })
    refreshTokenRememberMe!: boolean;

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

    // Relationships

    @OneToOne(
      () => StudentProfile,
      (studentProfile) => studentProfile.user,
      { cascade: true },
    )
    studentProfile?: StudentProfile;

    @OneToOne(
      () => TeacherProfile,
      (teacherProfile) => teacherProfile.user,
      { cascade: true }
    )
    teacherProfile?: TeacherProfile;

    @ManyToMany(() => Group, (group) => group.members)
    groups?: Group[];

    @OneToMany(() => ProjectMember, (member) => member.user)
    projectMemberships?: ProjectMember[];

    @OneToMany(() => ResearchPostApplication, (application) => application.user)
    researchPostApplications?: ResearchPostApplication[];

    @OneToMany(() => Follow, (follow) => follow.follower)
    following: Follow[];

    @OneToMany(() => Follow, (follow) => follow.following)
    followers: Follow[];

    @OneToMany(() => TeamMember, (teamMember) => teamMember.user)
    teamMemberships: TeamMember[];

    @OneToMany(() => Application, (application) => application.applicant)
    applications: Application[];

    @OneToMany(() => Invitation, (invitation) => invitation.inviter)
    sentInvitations: Invitation[];

    @OneToMany(() => Invitation, (invitation) => invitation.invitee)
    receivedInvitations: Invitation[];

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Share, (share) => share.user)
    shares: Share[];
}