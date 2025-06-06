import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository"
import { startOfDay, endOfDay, eachDayOfInterval, format } from "date-fns"

export const GetDashboardStatsUseCase = async (
    appointmentRepository: IAppointmentRepository,
    doctorId: string,
    startDate: Date,
    endDate: Date
) => {

    const start = startOfDay(new Date(startDate))
    const end = endOfDay(new Date(endDate))

    const appointments = await appointmentRepository.findByDoctorIdAndDateRange(doctorId, start, end)

    const uniquePatients = new Set(appointments.map((app) => app.userId.toString())).size
    const totalAppointments = appointments.length
    const totalConsultations = appointments.filter((app) => app.isCompleted).length
    const totalRevenue = appointments
      .filter((app) => app.isCompleted)
      .reduce((sum, app) => sum + app.amount, 0);

    const days = eachDayOfInterval({ start, end })
    const appointmentCounts = new Array(days.length).fill(0)
    const revenueCounts = new Array(days.length).fill(0)

    appointments.forEach((appointment) => {
      const dayIndex = days.findIndex((day) => startOfDay(appointment.date).getTime() === day.getTime())
      if (dayIndex !== -1) {
        appointmentCounts[dayIndex]++
        revenueCounts[dayIndex] += appointment.amount
      }
    })

    const labels = days.map((day) => format(day, "MMM dd"))

    return {
      totalPatients: uniquePatients,
      totalAppointments,
      totalConsultations,
      totalRevenue,
      appointmentData: {
        labels,
        datasets: [{ label: "Appointments", data: appointmentCounts }],
      },
      revenueData: {
        labels,
        datasets: [{ label: "Revenue", data: revenueCounts }],
      },
    }
}


