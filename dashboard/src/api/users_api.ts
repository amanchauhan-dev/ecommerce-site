const serverUrl = 'http://localhost:8000/api/v1'

// All requests should be withCredentials=true

/**
 * Users request : auth (admin | employee)
 * 1. post : to create a new user   (auth:admin)
 * 2. get : to get all users
 * 3. get : to get a user by id
 * 4. delete: to delete a user by id   (auth: admin)
 */
export const userApi = `${serverUrl}/users`
/**
 * login request : public
 * type: post
 * fields : email and password
 */
export const loginApi = `${serverUrl}/users/login`;
/**
 * login request : public
 * type: post
 * fields : email and password
 */
export const dashboardLogin = `${serverUrl}/users/dashboard-login`;

/**
 * Get Personal detail : Personal user
 * type: get
 * fields : None
 * params: id
 */
export const getMyDetailsApi = `${serverUrl}/users/my-profile/get-details/`; // id -> at end
/**
 * Update Personal detail : Personal user
 * type: put
 * fields : fields to update IN(fname, lname, phone_number)
 */
export const updateDetailsApi = `${serverUrl}/users/my-profile/update-details/`;
/**
 * verify Identity : Personal user
 * type: put
 * fields : password
 */
export const verifyMyAccountApi = `${serverUrl}/users/my-profile/verify/`; // id -> at end
/**
 * verify Identity : Personal user
 * type: put
 * fields : password
 */
export const verifyMyEmailApi = `${serverUrl}/users/my-profile/verify-email/`; // id -> at end
/**
 * verify Identity : Personal user
 * type: put
 * fields : password
 */
export const updateMyVerifiedEmailApi = `${serverUrl}/users/my-profile/update-email`; 
/**
 * verify Identity : Personal user
 * type: put
 * fields : password
 */
export const resetPassword = `${serverUrl}/users/my-profile/reset-password`; 