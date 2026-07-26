import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    equipmentId: { type: String, required: true },
    equipmentName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
