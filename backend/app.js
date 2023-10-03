require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
require('./src/DataBase/connetion')
PORT = process.env.Port
const User = require('./src/Models/userModels')

const cors = require('cors');
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
const user_routes = require('./src/Routes/userRoutes')
const admin_routes = require('./src/Routes/adminRoutes')
const blog_routes = require('./src/Routes/blogRoutes')
// const openAI_routes = require('./src/Routes/openAI-Routes')


app.get('/app', (req, res) => {
    res.send("App Working")
});

// app.post('/create-payment-stripe', async (req, res) => {
//     console.log(req.body);
//     try {
//         const { words, price } = req.body;
//         console.log("here")
//         // Calculate the amount based on the price and convert it to cents
//         const amountInCents = price * 100;
//         const session = await stripe.checkout.sessions.create({
//             // payment_method_types: ['card', 'paypal'],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         unit_amount: price * 100, // Amount in cents
//                         product_data: {
//                             name: `Custom Product Name ${words}`,
//                         },
//                     },
//                     quantity: 1,
//                 },
//             ],
//             mode: "payment",
//             success_url: "http://localhost:5000/success2",
//             cancel_url: "http://localhost:5000/cancel",
//         })
//         if (session){
//             const storeTemp = await User.updateOne({_id:user._id},
//                 {
//                     $set: {
//                         temp_words: words,
//                         temp_price: price,
//                         temp_discount: discount,
//                         temp_session : session.id
//                     }
//                 })

//         }
//         return res.status(200).json({ id: session.id })
//     } catch (error) {
//         console.error(error); // Log the error for debugging
//         return res.status(500).json({ message: "Failed" }) // Return a 500 status code for server errors
//     }
// })

// app.post('/success-stripe-payment', async (req, res) => {
//     console.log('succeses');
//     const user = req.rootUser;
//     const updateUser = await User.updateOne({_id:user._id},{
//         $push:{
//             payment_details:{
//                 plan : user.temp_words,
//                 discountUse:user.temp_discount,
//                 price:user.temp_price,
//                 success:true,
//                 payment_response:temp_session
//             },
//         },
//     });
//     return res.status(200).json({msg:"Payment Success",user:updateUser})
// })
// app.get('/cancel', async (req, res) => {
//     console.log('Cancel');
// })

app.use('/api/user',user_routes);
app.use('/api/admin',admin_routes);
app.use('/api/blog',blog_routes);


app.listen(PORT, () => {
    console.log(`Server Running at port ${PORT} .`)
})

