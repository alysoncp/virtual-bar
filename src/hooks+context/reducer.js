export const initialState = {
	user: null,
	userLocation: null,
	idToken: null,
};

export const actionTypes = {
	SET_USER: "SET_USER",
};

const reducer = (state, action) => {
	console.log(action);

	switch (action.type) {
		case actionTypes.SET_USER:
			return {
				...state,
				user: action.user,
				userLocation: action.location,
				idToken: action.idToken,
			};
		default:
			return state;
	}
};

export default reducer;
