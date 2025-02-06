const serverUrl = process.env.VITE_SERVER_URL

// All requests should be withCredentials=true

/**
 * Users request : auth (all)
 * 1. post : to create a new category   (auth:employee)
 * 2. get : to get all categories
 * 3. get : to get a user by id
 * 4. delete: to delete a user by id   (auth: admin)
 */
export const productApi = `${serverUrl}/products`
