require("dotenv").config();
const express = require("express");
const cors = require("cors"); // CORS importálása
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = 3000;

// CORS engedélyezése minden beérkező kérésre
app.use(cors());

app.use(express.static("public"));
app.use(express.json());

// Fizetési session létrehozása
app.post("/create-checkout-session", async (req, res) => {
  try {
    const cartItems = req.body.cart;
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "huf",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id }); // Fontos: session.id visszaadása JSON formátumban
  } catch (error) {
    console.error("Hiba a fizetési session létrehozásakor:", error);
    res
      .status(500)
      .json({ error: "Valami hiba történt a fizetési folyamatban." });
  }
});

// Szerver indítása
app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
