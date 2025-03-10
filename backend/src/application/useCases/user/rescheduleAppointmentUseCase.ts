import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository"; 
import { ISlotRepository } from "../../../domain/repositories/ISlotRepository"; 

const rescheduleAppointmentUseCase = async (
    appointmentId: string,
    date: string,
    slotId: string,
    timeSlotId: string,
    time: string,
    modeOfVisit: "Video" | "Clinic",
    appointmentRepository: IAppointmentRepository,
    slotRepository: ISlotRepository
) => {
    const appointment = await appointmentRepository.findAppointmentsById(appointmentId);
    if (!appointment) throw new Error("Appointment not found");

    const previousSlotId = appointment.slotId.toString();
    const previousTimeSlotId = appointment.timeSlotId.toString();

    await slotRepository.updateSlotStatus(previousSlotId, previousTimeSlotId, "Not Booked");

    const updates = {
        date: new Date(date),
        slotId,
        timeSlotId,
        time,
        modeOfVisit 
    }
    
    const updatedAppointment = await appointmentRepository.updateAppointment(appointmentId, updates);

    await slotRepository.updateSlotStatus(slotId, timeSlotId, "Booked");

    return updatedAppointment;
};

export default rescheduleAppointmentUseCase;