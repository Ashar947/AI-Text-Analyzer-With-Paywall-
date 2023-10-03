const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // required: true,  // Required will also be removed due to facebook
        // unique: true  //unique will be set to true before deployment
    },
    fingerprint: {
        type: String,
        required:true
    },
    user_ipAddress:{
        type:String,
        required:true
    },
    domain: {
        type: String,
        enum: {
            values: ["self", "google"],
            message: `{VALUE} is not supported`
        },
        required: true
    },
    phone: {
        type: Number,
        required: true,
        // unique: true  //unique will be set to true before deployment
    },
    // Password is not set to required true due to google authenticaton .
    // When domain will be self then only password will be required. which can be done through backend .
    password: {
        type: String,
    },
    type: {
        type: String,
        // required: true
    },
    domain:{
        type:String,
        required:true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    isTrial:{
        type:Boolean,
        default:true
    },
    wordLimit: {
        type: Number,
        default: 150
    },
    referedBy:{
        type:String
    },
    referalToken: {
        type: String
    },
    
    
    :{
        type:Number,
        default:0
    },
    subscriptionStartDate:{
        type:Date
    },
    subscriptionEndDate:{
        type:Date
    },
    temp_words:{
        type:Number,
    },
    temp_price:{
        type:Number,
    },
    temp_discount:{
        type:Boolean,
    },
    temp_session:{
        type:String,
    },
    temp_time:{
        type:String,
    },
    payment_details: [
        {
            plan: {
                type: String,
                required: true
            },
            discountUse: {
                type: Boolean,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            success: {
                type: Boolean,
                required: true
            },
            payment_response: {
                type: String,
                required: true
            },
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})




// hasing passowrd
userSchema.pre('save', async function (next) {
    try{
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    let generateReferal = jwt.sign({ _id: this._id }, process.env.SECRETKEY);
    let limitedReferalToken = generateReferal.substr(0, 20);
    this.referalToken = limitedReferalToken;
    // await this.save();
    next();
}catch(error){
    throw new Error('Error Creating Account');
}
})


// Genrating Token
userSchema.methods.generateAuthToken = async function () {
    try {
        let genToken = jwt.sign({ _id: this._id }, process.env.SECRETKEY);
        this.tokens = this.tokens.concat({ token: genToken });
        await this.save();
        return genToken;

    } catch (error) {
        console.log(`error is ${error}`);
    }
}

userSchema.methods.addSeachQuery = async function (query) {
    try {
        let search_query = this.searchQuery.concat({ user_query: query });
        await search_query.save();
    } catch (error) {
        console.log(`Error is ${error}`)
        res.status(410).json({ msg: "Cannot Add Query" })
    }
}


userSchema.methods.comparePassword = async function (enteredPassword, next) {
    return await bcrypt.compare(`${enteredPassword}`, `${this.password}`);

}


module.exports = mongoose.model('User', userSchema);
