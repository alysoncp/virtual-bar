export const initialState = {
	user: null,
	userLocation: null,
	idToken: null,
	at_bar: null,
	at_table: null
};

export const actionTypes = {
	SET_USER: "SET_USER",
	SET_BAR: "SET_BAR",
	SET_TABLE: "SET_TABLE"
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
		case actionTypes.SET_BAR:
			return {
				...state,
				at_bar: action.at_bar,
			};	
		case actionTypes.SET_TABLE:
			return {
				...state,
				at_table: action.at_table,
			}	
		default:
			return state;
	}
};

export default reducer;
