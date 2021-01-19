export const initialState = {
	user: null,
	userLocation: null,
	idToken: null,
	at_bar: null,
	at_table: null,
	last_bar: null,
	last_table: null,
};

export const actionTypes = {
	SET_USER: "SET_USER",
	SET_BAR_AND_TABLE: "SET_BAR_AND_TABLE",
	LEAVE_BAR_OR_TABLE: "LEAVE_BAR_OR_TABLE"
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
		case actionTypes.SET_BAR_AND_TABLE:
			return {
				...state,
				at_bar: action.at_bar,
				at_table: action.at_table,
				last_bar: action.at_bar,
				last_table: action.at_table,
			};	
		case actionTypes.LEAVE_BAR_OR_TABLE:
			return {
				...state,
				at_bar: action.at_bar,
				at_table: action.at_table,
			};	
		default:
			return state;
	}
};

export default reducer;
