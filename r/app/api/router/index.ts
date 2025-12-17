import { NextResponse } from "next/server"; 

export function GET() {
    return NextResponse.json({
        user: "Rohan Dev Singh",
        email: "rohan@gmail.com"
    });
}

// Function to handle POST requests

/*
Notes:
When there are multiple functions in a module, the default export cannot be used. 
In such cases, we use named exports and import them like this: 
--- import { GET } from '.api/v1/user'

However, if there is only one function, we can use default export and import it like this: 
--- import GET from ".api/v1/user"
*/