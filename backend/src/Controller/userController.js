const { json } = require("express");
const axios = require('axios');
const User = require('../Models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const wordCount = require("word-count");
var validator = require("email-validator");
var ip = require('ip');
// EnterkeyHere
const stripe = require("stripe")("enterkeyhere")



// Custom Functions

const throw_error = (errorMsg) => {
    console.log("throw error")
    const error_response = new Error(errorMsg);
    error_response.message = errorMsg;
    throw error_response;
}

const updateSubsriptionStatus = async (req, res, user) => {
    if (user.isTrial) {
        const updateUser = await User.updateOne({ _id: user._id },
            {
                $set: {
                    isTrial: false,
                    wordLimit: 0
                }
            });
        throw_error("Your Trail Has Expired");
        // res.status(410).json({ trailExpired: true, message: "Your Trail Has Expired " })
    } else if (user.isPaid) {
        const updateUser = await User.updateOne({ _id: user._id },
            {
                $set: {
                    isTrial: false,
                    isPaid: false,
                    wordLimit: 0
                }
            });
        throw_error("Your Subscription Has Expired");
    } else {
        throw_error("Your Trail and Subscription Has Been Finished")
    }


};

const setCountFalse = async (user) => {
    if (user.isTrial && user.wordLimit == 0) {
        const stopUser = await User.updateOne({ _id: user._id }, {
            $set: {
                isTrial: false,
                wordLimit: 0
            }
        });
        throw_error("Your Trail Has Been Expired");
        // return res.status(410).json({ trailExpired: true, message: "Your Trail Has Been Expired" })
    } else if (user.isPaid && user.wordLimit == 0) {
        const stopUser = await User.updateOne({ _id: user._id }, {
            $set: {
                isPaid: false,
                wordLimit: 0
            }
        });
        throw_error("Your Subscription Has Been Expired");
        // return res.status(411).json({ subscriptionExpired: true, message: "Your Subscription Has Been Expired" })
    }
    else{
        console.log("");
    }

};

const callFlaskLLM = async (jsonData) => {
    try {
        const response = await axios.post('http://127.0.0.1:8080/process-text', jsonData);
        console.log(response.data.processed_text);
        return response.data.processed_text;
    } catch (error) {
        console.log("Error occurred:", error);
        const error_response = new Error('Cannot Run Python Script at the moment');
        error_response.message = 'Cannot Run Python Script at the moment';
        throw error_response;
    }
};

const checkUserStatus = async (user) => {
    if (!(user.isTrial || user.isPaid)) {
        throw_error("Please Subscribe to Use This Feature");
        // return res.status(411).json({ subscriptionExpired: true, message: "Please Subscribe to Use This Feature" })
    } else {
        console.log("User Can Access")
    }
}

// URL Functions

const createNew = async (req, res) => {
    try {
        // console.log(req.body);
        const ipAddress = ip.address();
        console.log(ipAddress);
        if (ipAddress.length == 0) {
            throw_error("It seems you are using a third party extension to disable access to IP");
        };
        const { fullName, email, phone, password, referedBy, fingerprint } = req.body;
        if (fullName.length == 0 || phone.length == 0 || email.length == 0 || password.length == 0) {
            console.log("fields cannot be left empty");
            throw_error("Fields cannot be left empty");
        }
        if (fingerprint.length == 0) {
            throw_error("FingerPrint Cannot Be Access At The Moment")
        }
        if (!validator.validate(email)) {
            throw_error("Please Enter A Valid Email")
            // return res.status(205).json({error:"Please Enter A Valid Email"})
        }
        // const user_fingerprint = await User.findOne({fingerprint:fingerprint})
        // if (user_fingerprint) {
        //     console.log("user already registered");
        //     throw_error(`You are already registered as ${user_fingerprint.email} . Please SignIn using Your Email`);
        //     // return res.status(422).json({ error: "User already exist with this email" });
        // }
        // const user_ip = await User.findOne({user_ipAddress:ipAddress})
        // if (user_ip) {
        //     console.log("user already registered");
        //     throw_error(`You are already registered as ${user_ip.email} with this IP Address . Please SignIn using Your Email`);
        //     // return res.status(422).json({ error: "User already exist with this email" });
        // }
        const checkUser = await User.findOne({ email: email });
        // console.log(checkUser);  // null or user
        if (checkUser) {
            console.log("user already registered");
            throw_error("User already registered");
            // return res.status(422).json({ error: "User already exist with this email" });
        }
        console.log(referedBy.length != 0)
        if (referedBy.length != 0) {
            console.log("refered by running")
            const referedUser = await User.findOne({ referalToken: referedBy })
            // It will return null or userData .....
            if (referedUser) {
                console.log("Referred User Found");
                const updateRefUser = await User.updateOne({ referalToken: referedBy },
                    {
                        $set: {
                            referalTokenUse: referedUser.referalTokenUse + 1
                        }
                    });
                const createUser = new User({ fullName, email, domain: "self", phone, password, referedBy: referedUser.email, user_ipAddress: ipAddress, subscriptionStartDate: new Date(), subscriptionEndDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), fingerprint: fingerprint });
                await createUser.save();
                console.log("User Created With Referal");
                return res.status(200).json({ message: "User Created With Referal", User: createUser })
            } else {
                throw_error("Invalid Referal Link . Please TRY AGAIN ......");
                // return res.status(405).json({ message: "Invalid Referal Link . Please TRY AGAIN .........." })
            }
        }
        console.log("NOT refered by ")
        const createUser = new User({ fullName, email, domain: "self", phone, password, user_ipAddress: ipAddress, subscriptionStartDate: new Date(), subscriptionEndDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), fingerprint: fingerprint });
        await createUser.save();
        console.log("User Created");
        return res.status(200).json({ message: "User Created", User: createUser })
    } catch (error) {
        res.status(404).json({ msg: "Error", message: error.message })
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkUser = await User.findOne({ email: email });
        if (!checkUser) {
            throw_error("User Not Found . Please Register");
            // return res.status(400).json({ msg: "User Not Found" })
        }
        const passMatch = await bcrypt.compare(password, checkUser.password);
        // passMatch = true or false ;
        if (passMatch) {
            const token = await checkUser.generateAuthToken();
            res.cookie("jwtoken", token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            });
            res.status(200).json({ message: "User Logged In" });
        } else {
            throw_error("Password Incorrect");
            // return res.status(422).json({ error: "Password Incorrect" });
        }
    } catch (error) {
        return res.status(404).json({ msg: "Error", message: error.message })
    }
}

const createNew_facebook = async (req, res) => {
    // console.log(req.body);
    const { fullName, phone, type, referedBy, userID, accessToken } = req.body;
    if (userID.length == 0 || accessToken.length == 0) {
        console.log("fields cannot be left empty");
        return res.status(405).json({ error: "Inavlid Message" });
    }
    if (fullName.length == 0 || phone.length == 0, type.length == 0) {
        console.log("fields cannot be left empty");
        return res.status(204).json({ error: "fields cannot be left empty" });
    }
    try {
        const checkUser = await User.findOne({ email: userID });
        // console.log(checkUser);  // null or user
        if (checkUser) {
            console.log("user already registered");
            return res.status(422).json({ error: "User already exist with this FaceBook account" });
        }
        console.log(referedBy.length != 0)
        if (referedBy.length != 0) {
            console.log("here")
            const referedUser = await User.findOne({ referalToken: req.body.referedBy.length })
            // It will return null or userData .....
            if (referedUser) {
                console.log("Referred User Found");
                const updateRefUser = await User.updateOne({ referalToken: req.body.referedBy },
                    {
                        $set: {
                            referalTokenUse: referedUser.referalTokenUse + 1
                        }
                    });
                const createUser = new User({ fullName, email: userID, domain: "facebook", phone, type, referedBy: referedUser.email });
                await createUser.save();
                console.log("User Created With Referal");
                return res.status(200).json({ msg: "User Created With Referal", User: createUser })
            } else {
                return res.status(405).json({ error: "Invalid Referal Link . Please TRY AGAIN .........." })
            }
        }
        const createUser = new User({ fullName, email: userID, domain: "self", phone, type });
        await createUser.save();
        console.log("User Created");
        return res.status(200).json({ msg: "User Created", User: createUser })
    } catch (error) {
        res.status(404).json({ msg: "Error" })
    }
};

const login_facebook = async (req, res) => {
    try {
        const { email } = req.body;
        const checkUser = await User.findOne({ email: email });
        if (!checkUser) {
            return res.status(400).json({ msg: "User Not Found" })
        }
        const token = await checkUser.generateAuthToken();
        res.cookie("jwtoken", token, {
            httpOnly: true,
        });
        console.log(`Token is ${token}`);
        res.status(200).json({ message: "User Logged In" });
    } catch (error) {
        return res.status(404).json({ msg: "Error" })
    }
}

const createNew_google = async (req, res) => {
    // console.log(req.body);
    try {
        const ipAddress = ip.address();
        console.log(ipAddress);
        if (ipAddress.length == 0) {
            throw_error("It seems you are using a third party extension to disable access to IP");
        };
        const { fullName, email, phone, referedBy, email_verified, fingerprint } = req.body;
        if (!email_verified) {
            throw_error("Email Not Verified Please Try Again");
            // return res.status(405).json({ message: "Email Not Verified Please Try Again" })
        }
        if (fullName.length == 0 || phone.length == 0 || email.length == 0) {
            throw_error("Fields cannot be left empty");
            // console.log("fields cannot be left empty");
            // return res.status(204).json({ error: "fields cannot be left empty" });
        }
        const checkUser = await User.findOne({ email: email });
        // console.log(checkUser);  // null or user
        if (checkUser) {
            throw_error("User already registered");
        }
        console.log(referedBy.length != 0)
        if (referedBy.length != 0) {
            console.log("here")
            const referedUser = await User.findOne({ referalToken: req.body.referedBy.length })
            // It will return null or userData .....
            if (referedUser) {
                console.log("Referred User Found");
                const updateRefUser = await User.updateOne({ referalToken: req.body.referedBy },
                    {
                        $set: {
                            referalTokenUse: referedUser.referalTokenUse + 1
                        }
                    });
                const createUser = new User({ fullName, email, domain: "google", phone, referedBy: referedUser.email, fingerprint: fingerprint, user_ipAddress: ipAddress });
                await createUser.save();
                console.log("User Created With Referal");
                return res.status(200).json({ msg: "User Created With Referal", User: createUser })
            } else {
                throw_error("Invalid Referal Link . Please TRY AGAIN ..........");
            }
        }
        const createUser = new User({ fullName, email, domain: "google", phone, fingerprint: fingerprint, user_ipAddress: ipAddress });
        await createUser.save();
        console.log("User Created");
        return res.status(200).json({ message: "User Created", User: createUser })
    } catch (error) {
        res.status(404).json({ msg: "Error", message: error.message })
    }
};

const login_google = async (req, res) => {
    console.log(req.body)
    try {
        const { email } = req.body;
        if (email.length == 0) {
            throw_error("Fields cannot be left empty");
        }
        const checkUser = await User.findOne({ email: email });
        if (!checkUser) {
            throw_error("User Not Found");
        }
        const token = await checkUser.generateAuthToken();
        res.cookie("jwtoken", token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        });
        console.log(`Token is ${token}`);
        res.status(200).json({ message: "User Logged In" });
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

const currentUser = async (req, res) => {
    try {
        const getUser = req.rootUser;
        console.log(`Current User ${getUser}`)
        res.status(200).json({ status: true, message: "Current User", user: getUser,orderDetails:getUser.payment_details });
    } catch (error) {
        console.log(`Error is ${error}`)
        return res.status(404).json({ status: false, message: "Error" })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("jwtoken", { path: "/" });
        return res.status(200).json({ message: "User Logged Out" });
    } catch (error) {
        return res.status(404).json({ catch: true, message: error });
    }
}

const resetPassword = async (req, res) => {
    try {
        const user = req.rootUser;
        const { oldPassword, newPassword, confrimPassword } = req.body;
        if (oldPassword.length == 0 || newPassword.length == 0 || confrimPassword.length == 0) {
            return res.status(204).json({ status: false, message: "Fields cannot be left blank" });
        }
        if (newPassword != confrimPassword) {
            return res.status(401).json({ status: false, message: "Password doesnot match" });
        }
        const checkUser = await User.findOne({ _id: user._id });
        if (!checkUser) {
            return res.status(400).json({ status: false, message: "User Not Found" });
        }
        const isPasswordMatched = await checkUser.comparePassword(oldPassword);
        console.log(`isPasswordMatched == ${isPasswordMatched}`)
        if (!isPasswordMatched) {
            return res.status(502).json({ status: false, message: "Invalid Password" });
        }
        const newPassHash = await bcrypt.hash(newPassword, 12);
        const update = await User.updateOne({ _id: user._id },
            {
                $set: { password: newPassHash },
            }
        );
        res.clearCookie("jwtoken", { path: "/" });
        return res.status(200).json({ status: true, message: "Password Updated . Please Login Again With New Password", update: update });
    } catch (error) {
        return res.status(404).json({ catch: true, errormsg: error });
    }
}

const userUpadte = async (req, res) => {
    try {
        const user = req.rootUser;
        const { fullName, email, phone, type } = req.body;
        const getUser = await User.updateOne({ _id: user._id },
            {
                $set: {
                    fullName: fullName,
                    // email:email, // email cannot be updated
                    phone: phone,
                    type: type
                }
            });
        return res.status(200).json({ status: true, message: "User Updated", user: getUser })
    } catch (error) {
        return res.status(404).json({ catch: true, errormsg: error, message: "User cannot be updated at the moment. Please try again later ." })
    }
}

const textAnalyzer = async (req, res) => {
    try {
        const user = req.rootUser;
        await checkUserStatus(user);
        const { text } = req.body;
        if (text.length == 0) {
            throw_error("Fields cannot be left blank");
        }
        if (user.subscriptionEndDate < new Date()) {
            await updateSubsriptionStatus(req, res, user);
        }

        console.log(`Entered Text is : \n ${text}`);
        const data = {
            text: text,
            ip: user.user_ipAddress,
            fingerprint: user.fingerprint,
            user_id: user._id
        };
        const responseText = await callFlaskLLM(data);
        console.log(responseText)
        console.log("responseText 56521321321")
        const count = wordCount(text);
        console.log(`Word Count is ${count}`);
        if (count > user.wordLimit) {
            if (user.wordLimit == 0) {
                setCountFalse(user);
            } else if (user.wordLimit > 0) {
                return res.status(250).json({ message: "You have entered words greater than your word limit . Please Enter Words with in your word limit . ", limitRemaining: user.wordLimit })
            }
            return res.status(403).json({ status: false, message: "Search Limit Exceeded . Please Subscribe to Avail More Features", limitRemaining: user.wordLimit })
        }
        console.log("here")
        const getUser = await User.updateOne({ _id: user._id },
            {
                $set: {
                    wordLimit: user.wordLimit - count
                }
            });
        // await getUser.save();
        console.log(`Left search limit is ${req.rootUser.wordLimit - count}`);
        return res.status(200).json({ status: true, message: responseText, enteredText: text, analyzedText: "none", })
    } catch (error) {
        console.log(`Error is ${error}`);
        return res.status(404).json({ catch: true, message: error.message })
    }
}


const create_payment_stripe = async (req, res) => {
    console.log(req.body);
    try {
        const { words, price, duration, currency } = req.body;
        const user = req.rootUser;
        let discount = false;
        let finalPrice;
        const totalPrice = price;
        const refNum = user.referalTokenUse;
        if (refNum > 0) {
            discount = true
            finalPrice = (totalPrice) - ((totalPrice) * 10 / 100);
            console.log(`Final Price to be Charged is ${finalPrice}`);
            const update = await User.updateOne({ _id: user._id },
                {

                    $set: {
                        referalTokenUse: user.referalTokenUse - 1
                    }
                });
        } else {

            finalPrice = totalPrice;
        }
        const session = await stripe.checkout.sessions.create({
            // payment_method_types: ['card', 'paypal'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        unit_amount: finalPrice * 100, // Amount in cents
                        product_data: {
                            name: `Subscription for ${words} Words`,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        })
        if (session) {
            const storeTemp = await User.updateOne({ _id: user._id },
                {
                    $set: {
                        temp_words: words,
                        temp_price: finalPrice,
                        temp_discount: discount,
                        temp_session: session.id,
                        temp_time: duration
                    }
                })

        }
        return res.status(200).json({ id: session.id });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(404).json({ message: "Payment Failed" }) // Return a 500 status code for server errors
    }

}

const subscription = async (req, res) => {
    try {
        let time;
        console.log('succeses');
        const user = req.rootUser;
        if (user.temp_time === "m") {
            time = 30;
        } else if (user.temp_time === "y") {
            time = 365;
        }
        const updateTemp = await User.updateOne({ _id: user._id },
            {
                $set: {
                    isTrial: false,
                    isPaid: true,
                    subscriptionStartDate: new Date(),
                    subscriptionEndDate: new Date(new Date().getTime() + time * 24 * 60 * 60 * 1000),
                    wordLimit: user.temp_words,
                    temp_words: 0,
                    temp_price: 0,
                    temp_discount: false,
                    temp_session: "",
                    temp_time: ""
                }
            })
        const updateUser = await User.updateOne({ _id: user._id }, {
            $push: {
                payment_details: {
                    plan: user.temp_words,
                    discountUse: user.temp_discount,
                    price: user.temp_price,
                    success: true,
                    payment_response: user.temp_session
                },
            },
        });
        return res.status(200).json({ message: "Payment Success", user: updateUser })
    } catch (error) {
        console.log("error");
        console.log(error);
        return res.status(400).json({ message: "Payment Failed" })
    }
};

const getReferalToken = async (req, res) => {
    try {
        const user = req.rootUser;
        const refToken = user.referalToken;
        return res.status(200).json({ status: true, token: refToken, name: user.fullName , remainingWords:user.wordLimit });
    } catch (error) {
        return res.status(404).json({ status: false, messgae: error })
    }
}

const checkPaymentPage = async (req, res) => {
    try {
        const user = req.rootUser;
        if (user.temp_words > 0) {
            return res.status(200).json({ message: "Please Wait While We Proceed With Your Payment .", status: true })
        } else {
            throw_error("You are not allowed on This Page ");
        }
    } catch (error) {
        return res.status(404).json({ status: false, error: error.message });
    }
}


module.exports = { checkPaymentPage, getReferalToken, create_payment_stripe, createNew, login, currentUser, logoutUser, resetPassword, userUpadte, textAnalyzer, subscription, createNew_google, login_google, createNew_facebook, login_facebook };