import { Request, Response } from "express"
import PrescriptionUseCase from "../../../application/useCases/PrescriptionUseCase"
import { getAppointmentsByIdUseCase } from "../../../application/useCases/user/getAppointmentByIdUseCase";
import { createAppointmentRepository } from "../../database/repositories/AppoinmentRepository";


export const prescriptionController = {
  

  async createPrescription(req: Request, res: Response): Promise<void> {
    try {
      
      const prescription = await PrescriptionUseCase.createPrescription(req.body)
      res.status(201).json(prescription)
    } catch (error: any) {
      res.status(500).json({ error: error.message || "An error occurred while creating the prescription" })
    }
  },

  async getPrescription(req: Request, res: Response): Promise<void> {
    try {
      
      const prescription = await PrescriptionUseCase.getPrescription(req.params.appointmentId)
      if (prescription) {
       
        res.status(200).json({prescription})
      } else {
        res.status(404).json({ error: "Prescription not found" })
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message || "An error occurred while fetching the prescription" })
    }
  },

  async updatePrescription(req: Request, res: Response): Promise<void> {
   
    const prescriptionData = req.body.prescription
    try {
      const prescription = await PrescriptionUseCase.UpdatePrescription(req.params.id, prescriptionData)
      if (prescription) {
        res.json(prescription)
      } else {
        res.status(404).json({ error: "Prescription not found" })
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message || "An error occurred while updating the prescription" })
    }
  },

  async getPrescriptionForUser(req: Request, res: Response): Promise<void> {
    const appointmentId = req.params.appointmentId;
    try {
      const prescription = await PrescriptionUseCase.getPrescription(appointmentId)
      if (!prescription) {
        res.status(404).json({ error: "Prescription not found" });
        return;
      }
      
      const appointmentRepository = createAppointmentRepository();
      const appointment = await getAppointmentsByIdUseCase(appointmentId, appointmentRepository)
      const doctor = appointment.doctorId;

      res.status(200).json({ prescription, doctor });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "An error occurred while fetching the prescription" })
    }
  }
}

