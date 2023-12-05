import { userTypes } from "./user.types.js";

const initialState = {
  currentUser: null,
  userInfo: null,
  token: null,
  image_url: "",
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case userTypes.logIn:
      return {
        ...state,
        currentUser: action.payload.user,
        userInfo: action.payload.userInfo,
        ...(action.payload.token && {
          token: action.payload.token,
        }),
        ...(action.payload.provisionAccount && {
          provisionAccount: action.payload.provisionAccount,
        }),
      };
    case userTypes.userImageRemove:
      return {
        ...state,
        image_url: "",
      };
    case userTypes.userImageSuccess:
      return {
        ...state,
        image_url: action.payload,
      };
    case userTypes.refreshSuccess:
      return {
        ...state,
        currentUser: action.payload,
      };
    case userTypes.logOut:
      return initialState;
    default:
      return state;
  }
};
