var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_stripe = __toESM(require("stripe"), 1);
import_dotenv.default.config();
var stripe = process.env.STRIPE_SECRET_KEY ? new import_stripe.default(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-08-26.dahlia" }) : null;
var STRIPE_PRICE_MAPPING = {
  "sensual-massage-2h": "price_1UFg4uK4oxA1kFWILcHwYrAp",
  "sensual-massage-3h": "price_1UFg5LK4oxA1kFWI1c54A5Gv",
  "de-armouring-2h": "price_1UFg4xK4oxA1kFWIi7tccoc7",
  "de-armouring-3h": "price_1UFg5PK4oxA1kFWI46uPNZLD",
  "pelvic-mapping-2h": "price_1UFg52K4oxA1kFWI0FlaWk5s",
  "pelvic-mapping-3h": "price_1UFg5SK4oxA1kFWIEdyDAUlw",
  "pelvic-floor-2h": "price_1UFg55K4oxA1kFWI5hMXBxUI",
  "pelvic-floor-3h": "price_1UFg5WK4oxA1kFWIRLPhDrK4",
  "individual-consultation": "price_1UFg59K4oxA1kFWImzbm5wFi",
  "mens-practices-2h": "price_1UFg5DK4oxA1kFWISz5ex56G",
  "mens-practices-3h": "price_1UFg5aK4oxA1kFWInQcCrueT",
  "face-massage-2h": "price_1UFg5GK4oxA1kFWIasfBH7Eg",
  "pregnancy-massage-2h": "price_1UFgwbK4oxA1kFWICrlVkSu4",
  "pregnancy-massage-1h": "price_1UFgxfK4oxA1kFWIaWzSHCF3",
  "breathing-birth": "price_1UFgwpK4oxA1kFWIZaJG7BxJ",
  "massage-birth": "price_1UFgwtK4oxA1kFWI4itO9Wdg",
  "ritual-before-birth": "price_1UFgwwK4oxA1kFWIPM1kt65A",
  "postpartum-massage-2h": "price_1UFgx0K4oxA1kFWIs5Hll9TU",
  "postpartum-massage-1h": "price_1UFgxiK4oxA1kFWIilKBWG61",
  "challenging-birth-consultation": "price_1UFgx3K4oxA1kFWIHyRuThnA",
  "personal-training": "price_1UFgx7K4oxA1kFWIPZntl1kY",
  "personal-training-10x": "price_1UFgx9K4oxA1kFWIHFTCcpkO",
  "duo-training": "price_1UFgxFK4oxA1kFWIXIy3J2jX",
  "monthly-starter": "price_1UFgxIK4oxA1kFWIqYSgX2VL",
  "training-plan": "price_1UFgxLK4oxA1kFWIqFpMuHBJ",
  "combined-plan": "price_1UFgxTK4oxA1kFWI4obhrF7U",
  "online-coaching": "price_1UFgxWK4oxA1kFWIf6q6TQwR",
  "meal-plan": "price_1UFgxPK4oxA1kFWILJv4tgfN",
  "online-coaching-vip": "price_1UFgxbK4oxA1kFWI8EuworY2"
};
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.post("/api/stripe/webhook", import_express.default.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !sig || !webhookSecret) {
      console.error("Webhook Error: Missing Stripe configuration");
      return res.status(400).send("Webhook configuration missing");
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        console.log(`Payment confirmed for booking: ${bookingId}`);
        const gasUrl = process.env.GOOGLE_SCRIPT_URL;
        if (gasUrl) {
          try {
            await fetch(gasUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "confirmPayment",
                bookingId
              })
            });
            console.log(`Google Sheets updated for ${bookingId}`);
          } catch (error) {
            console.error("Failed to sync payment to Google Sheets:", error);
          }
        }
      }
    }
    res.json({ received: true });
  });
  app.use(import_express.default.json());
  app.get("/api/backend-code", (req, res) => {
    try {
      const codePath = import_path.default.join(process.cwd(), "Code.gs");
      const code = import_fs.default.readFileSync(codePath, "utf-8");
      res.json({ code });
    } catch (error) {
      res.status(500).json({ error: "Failed to read Code.gs" });
    }
  });
  app.get("/api/stripe/diagnostics", async (req, res) => {
    const testKey = req.query.testKey;
    const activeStripe = testKey ? new import_stripe.default(testKey, { apiVersion: "2026-08-26.dahlia" }) : stripe;
    if (!activeStripe) {
      return res.json({
        connection: "FAILED",
        error: "No Stripe key provided. Please enter a test key or configure STRIPE_SECRET_KEY."
      });
    }
    const testPriceId = "price_1UFg59K4oxA1kFWImzbm5wFi";
    try {
      const account = await activeStripe.accounts.retrieve();
      let priceInfo = null;
      let priceExists = "NO";
      try {
        const price = await activeStripe.prices.retrieve(testPriceId, {
          expand: ["product"]
        });
        priceExists = "YES";
        const product = price.product;
        priceInfo = {
          id: price.id,
          currency: price.currency.toUpperCase(),
          amount: price.unit_amount ? price.unit_amount / 100 : 0,
          productName: product.name,
          active: price.active
        };
      } catch (err) {
        console.error("Price fetch error during diagnostics:", err.message);
      }
      res.json({
        connection: "OK",
        mode: account.settings?.dashboard.display_name?.includes("Test") || !account.details_submitted ? "TEST" : "LIVE",
        accountId: account.id,
        priceIdChecked: testPriceId,
        priceExists,
        priceDetails: priceInfo,
        rawMode: account.details_submitted ? "LIVE-CAPABLE" : "TEST-ONLY"
      });
    } catch (error) {
      res.json({
        connection: "FAILED",
        error: error.message,
        hint: "This usually means the STRIPE_SECRET_KEY is invalid or belongs to a different account."
      });
    }
  });
  app.post("/api/create-checkout-session", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to secrets." });
    }
    const { booking } = req.body;
    if (!booking) {
      return res.status(400).json({ error: "Missing booking data" });
    }
    const priceId = STRIPE_PRICE_MAPPING[booking.serviceId];
    if (!priceId) {
      console.error(`No Price ID found for service: ${booking.serviceId}`);
      return res.status(400).json({ error: "Invalid service for payment." });
    }
    const baseUrl = process.env.APP_URL || req.get("origin") || `http://${req.get("host")}`;
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: booking.email,
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        mode: "payment",
        success_url: `${baseUrl}/?booking-success=true&booking-id=${booking.id}`,
        cancel_url: `${baseUrl}/?booking-cancelled=true`,
        metadata: {
          bookingId: booking.id,
          serviceId: booking.serviceId,
          practitionerId: booking.practitionerId,
          date: booking.date,
          time: booking.startTime
        }
      });
      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe Session Error:", error);
      if (error.raw?.code === "resource_missing" && error.raw?.param === "line_items[0][price]") {
        return res.status(400).json({
          error: `Stripe Account Mismatch: The Price ID '${priceId}' does not exist in the Stripe account associated with your current secret key. Please ensure your STRIPE_SECRET_KEY belongs to the same account where you created the SHE Academy products.`
        });
      }
      res.status(500).json({ error: error.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath, {
      maxAge: "1d",
      index: false
    }));
    app.get("*", (req, res) => {
      const indexPath = import_path.default.join(distPath, "index.html");
      if (import_fs.default.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build artifacts not found. Please run "npm run build" first.');
      }
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] SHE Academy started on port ${PORT}`);
    console.log(`[SERVER] Environment: ${process.env.NODE_ENV || "development"}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
