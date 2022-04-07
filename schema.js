const { gql } = require('apollo-server-express');

exports.typeDefs = gql `
    scalar Date

    type Listing {
        _id: ID
        listing_id: String!
        listing_title: String!
        description: String!
        street: String!
        city: String!
        postal_code: String!
        price: Float!
        email: String!
        username: String!
    },
    type Booking {
        _id: ID
        listing_id: String
        booking_id: String
        booking_date: Date
        booking_start: Date
        booking_end: Date
        username: String
    },
    type User {
        _id: ID!
        username: String!
        firstname: String!
        lastname: String!
        password: String!
        email: String!
        type: String!
    },
    type ResultUser {
        status: Boolean!
        message: String!
        username: String!
        type: String!
    },
    type ResultToken {
        status: Boolean!
        message: String!
        token: String
        type: String
    }
    type Query {
        getAllUser: [User]
        login(username: String!, password: String): ResultToken!
        me: ResultUser!
        getAllBookings(username: String!): [Booking]
        getAllListings: [Listing]
        getListingById(listing_id: String!): [Listing]
        getAllListingsOnlyAdmin: [Listing]
        getListingByName(listing_title: String!):[Listing]
        getListingByCity(city: String!):[Listing]
        getListingByPo(postal_code: String!):[Listing]
        getLogin(username: String!, password: String!): User
    },
    type Mutation {
        addUser(username: String!,
            firstname: String!,
            lastname: String!, 
            password: String!, 
            email: String!
            type: String!
            token: String): User
        addListing(listing_id: String!,
            listing_title: String!,
            description: String!,
            street: String!,
            city: String!,
            postal_code: String!,
            price: String! ,
            email: String!,
            username: String): Listing
        addBooking(listing_id: String!, 
            booking_id: String!, 
            booking_date: Date!, 
            booking_start: Date!, 
            booking_end: Date!, 
            username: String): Booking
    }
`;

