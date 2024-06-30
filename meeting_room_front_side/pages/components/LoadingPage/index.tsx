import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";

export const LoadingPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.body}>
      <div className={classes.header}>
        <Skeleton variant="rect" width="100%" height="100%" />
      </div>
      <div className={classes.menu}>
        <Skeleton variant="rect" width="100%" height="100%" />
      </div>
      <div className={classes.container}>
        <Skeleton variant="rect" width="100%" height="100%" />
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  body: {
    display: "grid",
    padding: "4px",
    width: "100%",
    height: "100%",
    gridTemplateColumns: "0.2fr 1fr",
    gridTemplateRows: "0.1fr 1fr",
    gap: "3px 3px",
    gridTemplateAreas: " 'Header Header' 'Menu Contanier'",
  },
  header: {
    gridArea: "Header",
  },
  menu: {
    gridArea: "Menu",
  },
  container: {
    gridArea: "Contanier",
  },
}));

export default LoadingPage;