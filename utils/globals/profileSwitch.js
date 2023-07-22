import RIDER from "../../models/RIDER.js";
import USER from "../../models/USER.js";


export const switchProfile = (role) => {
    let profile
    try {
        switch (role) {
            case 'user':
                profile = USER;
                break;
            case 'rider':
                profile = RIDER;
                break;
            default:
                throw Error('Unsupported Role');
        }
        return profile;
    } catch (error) {
        throw error;
    }
}