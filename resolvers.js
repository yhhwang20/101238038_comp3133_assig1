const User = require('./models/User.js');
const { ApolloError } = require('apollo-server-errors');
const Listing = require('./models/Listing.js');
const Booking = require('./models/Booking.js');
const jwt = require("jsonwebtoken");

exports.resolvers = {
    Query: {
        getAllBookings: async (parent, args, context) => {
            if(context.user.type == 'user') {
                return Booking.find({
                    username: context.user.username
                });
            } else {
                throw new ApolloError('Not Authenticated');
            }
        },
        getAllListings: async (parent, args, context) => {
            if(context.user) {
                return Listing.find();
            } else {
                throw new ApolloError('Not Authenticated');
            }
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
            if (context.user){
                return Listing.find({ 
                    city: args.city 
                })
            } else {
                throw new ApolloError('Not Authenticated');
            }
            
        },
        getListingByName: async (parent, args, context) => {
            if (context.user){
                return Listing.find({ 
                    listing_title: args.listing_title 
                })
            } else {
                throw new ApolloError('Not Authenticated');
            }       
        },
        getListingByPo: async (parent, args, context) => {
            if (context.user){
                return Listing.find({ postal_code: args.postal_code })
            } else {
                throw new ApolloError('Not Authenticated');
            }       
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const userExist = await User.findOne({username: args.username});
            
            if (userExist){
                throw new ApolloError('A username is aleready existed');
            }
            const newUser = new User(args);
            newUser.save((err, success) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Created a user");
                }
            })
            return newUser;
        },
        addListing: async (parent, args, context) => {
            if (context.user.type == 'admin'){
                const list = new Listing(args);
                list.save((err, success) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Created a Listing");
                    }
                })
                return list;
            } else {
                throw new ApolloError('Not Authenticated');
            }       
          
        },
        addBooking: async (parent, args, context) => {
            if(context.user) {
                const userExist = await User.findOne({username: args.username});
                const listingExist = await Listing.findOne({listing_id: args.listing_id});
                
                if(userExist && listingExist){
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
            }
        },
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
           
            return { token, user };
        }
    }
}

