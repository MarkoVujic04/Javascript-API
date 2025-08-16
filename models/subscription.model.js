import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: 2,
        maxLenth: 100,
    },
    price: {
        type: Number,
        require: [true, "Subscription price is required"],
        min: 0,
    },
    currency: {
        type: String,
        enum: ["USD", "SEK"],
        default: "SEK",
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
        type: String,
        enum: ["sport", "news", "gaming", "tech"],
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active",
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: "Starting date must be in the past"
        }
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value >= this.startDate,
            message: "Starting date must be in the past"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,

    }
}, { timestamps: true })

subscriptionSchema.pre("save", function (next) {
    if(!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);

        if(this.renewalDate < new Date()) {
            this.status = "expired";
        }

        next();
    }
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;