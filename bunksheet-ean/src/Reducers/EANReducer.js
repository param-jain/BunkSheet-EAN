import { EAN_USER_BRANCH_SELECT } from '../Actions/types';

const INITIAL_STATE = { 
    branch: 'E&TC',
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {

        case EAN_USER_BRANCH_SELECT:
            return { ...state, branch: action.payload };

        default: 
            return state;
    }
};