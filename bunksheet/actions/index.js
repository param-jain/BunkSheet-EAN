import { 
    EMAIL_CHANGED, 
    PASSWORD_CHANGED, 
    LOGIN_ATTEMPTED,
    SIGNUP_EMAIL_CHANGED,
    SIGNUP_PASSWORD_CHANGED,
    SIGNUP_VERIFY_PASSWORD_CHANGED,
    SIGNUP_F_NAME_CHANGED,
    SIGNUP_L_NAME_CHANGED,
    SIGNUP_REG_ID_CHANGED,
    SIGNUP_ATTEMPTED,
    SIGNUP_OTP_CHANGED,
    LIBRARY_SEARCHTEXT_CHANGED,
    LIBRARY_NOTICE_COUNT
} from './types';


//Login Screen
export const emailChanged = (text) => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};
export const passwordChanged = (text) => {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    };
};
export const loginUser = ({ email, password }) => {
    return {
        type: LOGIN_ATTEMPTED,
    }
};

// Sign Up Screen 
export const signupEmailChanged = (text) => {
    return {
        type: SIGNUP_EMAIL_CHANGED,
        payload: text
    };
};
export const signupPasswordChanged = (text) => {
    return {
        type: SIGNUP_PASSWORD_CHANGED,
        payload: text
    };
};
export const signupVerifyPasswordChanged = (text) => {
    return {
        type: SIGNUP_VERIFY_PASSWORD_CHANGED,
        payload: text
    };
};

// Sign Up Details Screen
export const signupFNameChanged = (text) => {
    return {
        type: SIGNUP_F_NAME_CHANGED,
        payload: text
    };
};
export const signupLNameChanged = (text) => {
    return {
        type: SIGNUP_L_NAME_CHANGED,
        payload: text
    };
};
export const signupRegIDChanged = (text) => {
    return {
        type: SIGNUP_REG_ID_CHANGED,
        payload: text
    };
};
export const signupCreateAccount = ({ email, password, fName, lName, regID }) => {
    return {
        type: SIGNUP_ATTEMPTED,
    }
};

// OTP Confirmation Screen
export const signupOTPChanged = (text) => {
    return {
        type: SIGNUP_OTP_CHANGED,
        payload: text
    };
};


export const libraryNoticeCount = (text) => {
    return {
        type: LIBRARY_NOTICE_COUNT,
        payload: text
    };
};