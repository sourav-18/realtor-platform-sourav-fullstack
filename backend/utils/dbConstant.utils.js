module.exports = {
    owners: {
        status: {
            active: "active",
            inactive: "inactive"
        }
    },
    customers: {
        customerTypes: {
            guest: "guest",
            customer: "customer"
        },
        status: {
            active: "active",
            inactive: "inactive"
        }
    },
    property: {
        propertyType: [
            "apartment",
            "pg",
            "plots",
            "flats",
            "house",
        ],
        listingType: {
            sale: "sale",
            rent: "rent"
        },
        status: {
            active: "active",
            inactive: "inactive",
            delete: "delete",
        },
        topCities: [
            "Mumbai",
            "Delhi",
            "Bengaluru",
            "Hyderabad",
            "Chennai",
            "Kolkata",
            "Pune",
            "Ahmedabad",
            "Surat",
            "Jaipur"
        ],
        specifications:{
            bedrooms:"bedrooms",
            bathrooms:"bathrooms",
            area:"area", //sqft
        }
    }
}