(require("dotenv")).config()
const express = require("express")
const cors = require("cors")

const userRouter = require("./routes/user")
const supplierRouter = require("./routes/supplier")
const ingredientRouter = require("./routes/ingredient")
const foodRouter = require("./routes/food")
const authRouter = require("./routes/auth")
const facilityRouter = require("./routes/facility")
const uploadImgRouter = require("./routes/uploadImg")
const warehouseRouter = require("./routes/warehouse")
const inventoryRouter = require("./routes/inventory")
const saleRouter = require("./routes/sale")

const bodyParser = require("body-parser")
const { PrismaClient } = require("@prisma/client")

const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

app.get('/api/', (req, res) => {
    return res.json({success: true, message: "Connected"})
})

app.use(express.static(__dirname))

app.get('/config', (req, res)=>{
    return res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
})

// Stripe webhook
// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_2c6507c51bc54d1915ee040bc4dc6331dbd42e18d560b94395c8f3d06cf10a29";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        success_url: `${process.env.CLIENT_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_DOMAIN}/cancel`,
        payment_method_types: ['card'],
        
    })
})

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/suppliers', supplierRouter)
app.use('/api/ingredients', ingredientRouter)
app.use('/api/foods', foodRouter)
app.use('/api/facilities', facilityRouter)
app.use('/api/uploadImg', uploadImgRouter)
app.use('/api/warehouse', warehouseRouter)
app.use('/api/inventory', inventoryRouter)
app.use('/api/sale/', saleRouter)

app.listen(3000, () =>
    console.log('REST API server ready at: http://localhost:3000'),
)