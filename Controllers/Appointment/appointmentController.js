const Appointment = require("../../Models/Appointment");
const STATUS = ["pending", "confirmed", "cancelled", "completed"];

const createAppointment = async (req, res) => {
  try {
    const { shop, date, timeSlot } = req.body;

    const existing = await Appointment.findOne({
      shop,
      date: new Date(date),
      timeSlot,
      status: "confirmed",
    });

    if (existing) {
      return res.status(409).json({
        error: "This time slot is already booked. Please choose another.",
      });
    }
    const appointmentData = {
      ...req.body,
      user: req.user._id,
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAppointmentsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { shop: shopId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate("user", "name mobile")
        .sort({ date: 1, timeSlot: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Appointment.countDocuments(query),
    ]);

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: appointments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!STATUS.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const appointmentDate = new Date(appointment.date);

    const [startTime] = appointment.timeSlot.split("-");
    const [hours, minutes] = startTime.split(":").map(Number);

    appointmentDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    if (now > appointmentDate) {
      return res.status(400).json({
        error: "Cannot update status of a past appointment",
      });
    }

    if (STATUS.includes(appointment.status)) {
      return res.status(400).json({
        error: `Appointment is already ${appointment.status}, status cannot be changed`,
      });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsByShop,
  updateAppointmentStatus,
};
