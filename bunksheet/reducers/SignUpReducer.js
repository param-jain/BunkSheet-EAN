import { 
    SIGNUP_EMAIL_CHANGED, 
    SIGNUP_PASSWORD_CHANGED, 
    SIGNUP_VERIFY_PASSWORD_CHANGED,
    SIGNUP_F_NAME_CHANGED,
    SIGNUP_L_NAME_CHANGED,
    SIGNUP_REG_ID_CHANGED,
    SIGNUP_OTP_CHANGED,
    SIGNUP_ATTEMPTED
} from '../actions/types';

const INITIAL_STATE = { 
    email: '',  
    emailTouched: false, 
    password: '',
    passwordTouched: false,
    verifyPassword: '',
    verifyPasswordTouched: false,
    isAuthenticating: false,
    fName: '',
    fNameTouched: false,
    lName: '',
    lNameTouched: '',
    regID: '',
    regIDTouched: false,
    OTP: '',
    OTPTouched: false
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {

        case SIGNUP_EMAIL_CHANGED:
            return { ...state, email: action.payload, emailTouched: true };

        case SIGNUP_PASSWORD_CHANGED:
            return { ...state, password: action.payload, passwordTouched: true };

        case SIGNUP_VERIFY_PASSWORD_CHANGED:
            return { ...state, verifyPassword: action.payload, verifyPasswordTouched: true };

        case SIGNUP_F_NAME_CHANGED:
            return { ...state, fName: action.payload, fNameTouched: true };
    
        case SIGNUP_L_NAME_CHANGED:
            return { ...state, lName: action.payload, lNameTouched: true };

        case SIGNUP_REG_ID_CHANGED: 
            return { ...state, regID: action.payload, regIDTouched: true };

        case SIGNUP_ATTEMPTED:
            return { ...state, 
                email: '',  
                emailTouched: false, 
                password: '',
                passwordTouched: false,
                verifyPassword: '',
                verifyPasswordTouched: false,
                isAuthenticating: false,
                fName: '',
                fNameTouched: false,
                lName: '',
                lNameTouched: '',
                regID: '',
                regIDTouched: false,
            };

        case SIGNUP_OTP_CHANGED:
            return { ...state, OTP: action.payload, OTPTouched: true };

        default: 
            return state;
    }
};
