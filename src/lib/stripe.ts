import Stripe from "stripe";

// null when STRIPE_SECRET_KEY isn't set, so pages can show a message instead of crashing
export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;