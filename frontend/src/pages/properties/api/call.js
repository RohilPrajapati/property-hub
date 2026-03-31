import { PROPERTY_LISTING } from ".";
import { createClient } from '../../../plugins/axios';

// export const fetchProperties = (urlOrPage = 1, page_size = 9) => {
//     const client = createClient();

//     // Check if the first argument is a full URL (starts with http)
//     if (typeof urlOrPage === 'string' && urlOrPage.startsWith('http')) {
//         return client.get(urlOrPage, {
//             headers: { "Content-Type": "application/json" },
//         });
//     }

//     // Otherwise, treat it as a page number and build the default URL
//     return client.get(
//         `${PROPERTY_LISTING}?page=${urlOrPage}&page_size=${page_size}`,
//         {
//             headers: { "Content-Type": "application/json" },
//         }
//     );
// };

export const fetchProperties = (urlOrParams = null) => {
    const client = createClient();

    // If it's a full string URL (from Pagination 'next' link)
    if (typeof urlOrParams === 'string' && urlOrParams.startsWith('http')) {
        return client.get(urlOrParams);
    }

    // If it's an object (Filters), convert to query string
    const params = new URLSearchParams(urlOrParams).toString();
    return client.get(`${PROPERTY_LISTING}?${params}`);
};

export const fetchPropertyDetail = (id) => {
    console.log("working")
    const client = createClient();
    return client.get(`/listings/${id}/`);
};