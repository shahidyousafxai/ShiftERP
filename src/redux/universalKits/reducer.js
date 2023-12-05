import { GET_KIT_PARENT, SET_KIT_PARENT } from "./types";

const initialState = {
  getKitParentLoading: false,
  kitParent: [],
};

export const getKitParentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_KIT_PARENT:
      return {
        ...state,
        getKitParentLoading: true,
      };
    case SET_KIT_PARENT:
      return {
        ...state,
        getKitParentLoading: false,
        kitParent: action.payload,
      };
    default:
      return state;
  }
};
