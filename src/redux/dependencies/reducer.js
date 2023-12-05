import { GET_DEPENDENCIES, SET_DEPENDENCIES } from "./types";

const initialState = {
  getDependencyloading: false,
  allDependencies: [],
};

export const getAllDependenciesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DEPENDENCIES:
      return {
        ...state,
        getDependencyloading: true,
      };
    case SET_DEPENDENCIES:
      return {
        ...state,
        getDependencyloading: false,
        allDependencies: action.payload,
      };
    default:
      return state;
  }
};
