import { Doctor } from "../entities/Doctor";

export type IDoctorRepository = {
  findByEmail: (email: string) => Promise<Doctor | null>;
  create: (doctor: Doctor) => Promise<Doctor>;
  getAllDoctors: () => Promise<Doctor[]>;
  getDoctorsWithPagination: (skip: number, limit: number, query: any) => Promise<Doctor[]>
  getAllApprovedDoctors: () => Promise<Doctor[]>;
  countDoctors: (query: any) => Promise<number>;
  findDoctorById: (id: string) => Promise<Doctor | null>;
  updateDoctor: (id: string, updates: any) => Promise<Doctor | null>;
  getDoctorsByCriteria(query: any, sortOptions: any, skip: number, limit: number): Promise<{ doctors: any[]; totalDocs: number }>;
  getAllSpecializations: () => Promise<string[] | []> ;


};
