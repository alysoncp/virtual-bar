// React 
import React from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Custom CSS
import "./BarListing.css";

// Material UI Styles
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

function BarListing({ Icon, title, id, addChannelOption, barCreatorId }) {
	const history = useHistory();
	const [{ idToken }] = useStateValue();
	const classes = useStyles();

	const selectChannel = () => {
		if (id) {
			history.push(`/bar/${id}`);
		} else {
			history.push(title);
		}
	};

	const userCanDelete = (barIdToken, userIdToken) => {
		if (barIdToken === userIdToken) {
			return true;
		} else {
			return false;
		}
	};

	const deleteBar = () => {
		if (window.confirm("Are you sure you want to delete the bar?")) {
			db.collection("bars").doc(id).delete();
		} else {
			return;
		}
	};

	return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="https://cdn4.vectorstock.com/i/1000x1000/52/38/speed-beer-logo-icon-design-vector-22545238.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
					{title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Put description here.........
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={selectChannel}>
          Join Bar
        </Button>
				{userCanDelete(barCreatorId, idToken) && (
					<Button size="small" color="primary" onClick={deleteBar}>
						Delete Bar
					</Button>
				)}
      </CardActions>
    </Card>
  );

	// return (
	// 	<div className="bar_listing">
	// 		<div className="bar_listing_header">
	// 			<img
	// 				className="bar_logo"
	// 				src="https://cdn4.vectorstock.com/i/1000x1000/52/38/speed-beer-logo-icon-design-vector-22545238.jpg"
	// 				alt="beer logo"
	// 			/>
	// 			<h4>{title}</h4>
	// 		</div>
	// 		<div className="bar_description">
	// 			Need to add descriptions to database...
	// 		</div>
	// 		<button onClick={selectChannel}>Join Bar</button>
	// 		{userCanDelete(barCreatorId, idToken) && (
	// 			<button onClick={deleteBar}>Delete Bar</button>
	// 		)}
	// 	</div>
	// );
}

export default BarListing;
