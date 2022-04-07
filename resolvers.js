const User = require('./models/User.js');
const { ApolloError } = require('apollo-server-errors');
const Listing = require('./models/Listing.js');
const Booking = require('./models/Booking.js');
const jwt = require("jsonwebtoken");

exports.resolvers = {
    Query: {
        login: async (parent, {username, password}) =>{
            const user = await User.findOne({ username });
            if (!user) {
                throw new ApolloError("User not exist");
            }
            if (user.password !== password ){
                throw new ApolloError("Invalid password");
            }
            const token = jwt.sign(
                {
                    _id: user._id, 
                    type: user.type,
                    username: user.username
                },process.env.SUPER_SECRET, { expiresIn: "1h"}
            );
            user.token = token;
            console.log("Login succeess")
            return { 
                token: token, 
                type: user.type,
                status: true 
            };
        },
        me: (parent, args, context) => {
            console.log(context.token);
            const info = jwt.verify(context.token, process.env.SUPER_SECRET);
            console.log(info);
            return {
                status: true,
                message: "Token correct",
                username: info.username,
                type: info.type
            }
        },
        getAllUser: async (parent, args, context) => {
            return User.find();
        },
        getAllBookings: async (parent, args, context) => {
            return Booking.find({
                username: args.username
            });
        },
        getAllListings: async (parent, args, context) => {
            return Listing.find();
        },
        getListingById: async (parent, args, context) => {
            return Listing.find({
                listing_id: args.listing_id
            });
        },
        getAllListingsOnlyAdmin : async (parent, args, context) => {
            if(context.user.type == 'admin') {
                return Listing.find({
                    username: context.user.username
                });
            } else {
                throw new ApolloError('Not Authenticated');
            }
        },
        getListingByCity: async (parent, args, context) => {
            const listing = Listing.find({city: args.city})
            if(listing !== null){
                return listing
            } else {
                throw new ApolloError('The listing not existed!');
            } 
        },
        getListingByName: async (parent, args, context) => {
            const listing = Listing.find({listing_title: args.listing_title})
            if(listing !== null){
                return listing
            } else {
                throw new ApolloError('The listing not existed!');
            }    
        },
        getListingByPo: async (parent, args, context) => {
            const listing = Listing.find({postal_code: args.postal_code})
            if(listing !== null){
                return listing
            } else {
                throw new ApolloError('The listing not existed!');
            }      
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const userExist = await User.findOne({username: args.username});
            
            if (userExist){
                throw new ApolloError('A username is aleready registered');
            }
            const newUser = new User({
                username: args.username,
                firstname: args.firstname,
                lastname: args.lastname,
                password: args.password,
                email: args.email,
                type: args.type
            });
            
            //Create JWT
            const token = jwt.sign(
                { username: newUser.username, type: newUser.type},
                "SAFE_STRING",
                {
                    expiresIn: "1h"
                }
            );
            newUser.token = token;

            const res = await newUser.save((err, success) => {
                if (err) {console.log(err);}
                else {console.log("Created a user");}
            })

            return {
                username: newUser.username,
                type: newUser.type,
                token: newUser.token
            };
        },
        addListing: async (parent, args, context) => {
            const list = new Listing(args);
            list.save((err, success) =>{
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Created a Listing")
                }
            })
            return list;
            
        },
        addBooking: async (parent, args, context) => {
            const booking = new Booking(args);
            booking.save((err, success) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Created a Booking");
                }
            })
            return booking;
            } 
        }, 
}

