const keys_db = new Map<string, string[]>()
const locationHistory_db = new Map<string, string[]>()

const VISUAL_ROUTE = new URLPattern({ pathname: "/" });
const REGISTER_ROUTE = new URLPattern({ pathname: "/register" });
const GETKEY_ROUTE = new URLPattern({ pathname: "/getkey" });
const LOCATION_PUBLISH_ROUTE = new URLPattern({ pathname: "/location/publish" });
const LOCATION_RECIEVE_ROUTE = new URLPattern({ pathname: "/location/receive" });

const R_404: ResponseInit = { status: 404 };
const R_204: ResponseInit = { status: 204 };


async function handler(req: Request): Promisez<Response> {

    if (REGISTER_ROUTE.exec(req.url)) {
        const {userid, key} = await req.json();
        keys_db[userid] = key
        return new Response(null, R_204);
    }
    else if(GETKEY_ROUTE.exec(req.url)) {
        const {userid} = await req.json();
        const key = keys_db[userid];
        if(key)
            return new Response(key);
        else
            return new Response("Key not found", R_404);
    }
    else if(LOCATION_PUBLISH_ROUTE.exec(req.url)) {
        const {recipientUserID, encryptedLocation} = await req.json();
        if(!(locationHistory_db[recipientUserID])) {
            locationHistory_db[recipientUserID] = []
        }
        locationHistory_db[recipientUserID].push(encryptedLocation);
        return new Response(null, R_204);
    }
    else if(LOCATION_RECIEVE_ROUTE.exec(req.url)) {
        const {userid} = await req.json();
        const encryptedLocations = locationHistory_db[userid];
        locationHistory_db[userid] = [];
        if(encryptedLocations)
            return new Response(JSON.stringify(encryptedLocations), {headers: {"Content-Type": "application/json"}});
        else
            return new Response("Location not found", R_404);
    } else if(VISUAL_ROUTE.exec(req.url)) {
        return new Response("")
    } else {
        return new Response("Path not found", R_404);
    }
}

Deno.serve(handler);
