import mongoose from "mongoose";

function computeNextRenewal(startDate, frequency = "monthly") {
  const d = new Date(startDate);
  switch (frequency) {
    case "daily":   d.setDate(d.getDate() + 1); break;
    case "weekly":  d.setDate(d.getDate() + 7); break;
    case "monthly": d.setMonth(d.getMonth() + 1); break;
    case "yearly":  d.setFullYear(d.getFullYear() + 1); break;
    default:        d.setMonth(d.getMonth() + 1);
  }
  return d;
}

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: 0,
    },
    currency: { type: String, enum: ["USD", "SEK"], default: "SEK" },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
    },
    category: {
      type: String,
      enum: ["sport", "news", "gaming", "tech"],
      required: true,
    },
    paymentMethod: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          // if you want to allow future start dates, change to: return true;
          return v <= new Date();
        },
        message: "Starting date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      required: true,
      // default must be a regular function to access `this`
      default: function () {
        if (!this.startDate) return undefined; // let startDate required trigger
        return computeNextRenewal(this.startDate, this.frequency);
      },
      validate: {
        validator: function (v) {
          if (!v || !this.startDate) return true;
          return v >= this.startDate;
        },
        message: "renewalDate must be on or after startDate",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  if (this.renewalDate && this.renewalDate < new Date()) {
    this.status = "expired";
  }
  next();
});

export default mongoose.model("Subscription", subscriptionSchema);
