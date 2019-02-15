import { EAN_USER_BRANCH_SELECT, EAN_USER_YEAR_SELECT, EAN_USER_DIVISION_SELECT, EAN_USER_BATCH_SELECT } from '../Actions/types';

const INITIAL_STATE = { 
    branch: "Computer",
    year: "SE",
    division: "2",
    batch: "F"
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {

        case EAN_USER_BRANCH_SELECT:
            return { ...state, branch: action.payload };

        case EAN_USER_YEAR_SELECT:
            return { ...state, year: action.payload };

        case EAN_USER_DIVISION_SELECT:
            return { ...state, division: action.payload };

        case EAN_USER_BATCH_SELECT:
            return { ...state, batch: action.payload };
          
        default: 
            return state;
    }
};
