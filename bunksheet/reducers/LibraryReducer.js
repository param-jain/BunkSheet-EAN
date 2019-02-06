import { LIBRARY_SEARCHTEXT_CHANGED, LIBRARY_NOTICE_COUNT } from '../actions/types';

const INITIAL_STATE = {
    notice_count: 0,
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {

        case LIBRARY_NOTICE_COUNT:
        return { ...state, notice_count: action.payload };

        default: 
            return state;
    }
};