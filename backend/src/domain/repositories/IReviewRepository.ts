import { IReview } from "../../domain/entities/Review"

export interface IReviewRepository {
  createReview(reviewData: Partial<IReview>): Promise<IReview>
  getReviewsByAppointmentId(appointmentId: string): Promise<IReview[]>
  findByIdAndUpdate(id: string, updateData : Partial<IReview>): Promise<IReview | null>
  getReviewsByDoctorId(doctorId: string): Promise<IReview[]>
}