import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./menu-bar.module.css";
import Link from "next/link";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import ListIcon from "@material-ui/icons/List";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import EventIcon from "@material-ui/icons/Event";
import cookies from "next-cookies";
import jwt from "jsonwebtoken";
import { makeStyles } from "@material-ui/core/styles";
import { CookieDocument } from "@/libs/Types";

export const Menu = () => {
  const router = useRouter();
  const classes = useStyles();
  const [roomsPath, setRoomPath] = useState("");
  const [reservationPath, setReservationPath] = useState("");
  const [reservationStyle, setReservationStyle] = useState<string>();
  const [listReservationsStyle, setListReservationsStyle] = useState<string>();
  const [reservesStyle, setReservesStyle] = useState<string>();

  useEffect(() => {
    //session
    const { token } = cookies(document as CookieDocument);
    const json_user = jwt.decode(token, {json: true});
    setRoomPath("/list-reservations/" + json_user.defaultOffice);
    setReservationPath("/reservation/" + json_user.defaultOffice);

    if (router.pathname.includes("/reservation/")) {
      setReservationStyle(styles.div_btn_selected);
      setListReservationsStyle(styles.div_btn);
      setReservesStyle(styles.div_btn);
    }
    if (router.pathname.includes("/list-reservations/")) {
      setReservationStyle(styles.div_btn);
      setListReservationsStyle(styles.div_btn_selected);
      setReservesStyle(styles.div_btn);
    }
    if (router.pathname == "/reserves") {
      setReservesStyle(styles.div_btn_selected);
      setReservationStyle(styles.div_btn);
      setListReservationsStyle(styles.div_btn);
    }
  });

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          <Link href={reservationPath}>
            <div className={reservationStyle}>
              <EventIcon fontSize="large" />
              <Typography variant="h6" className={classes.text}>
                Reserves
              </Typography>
            </div>
          </Link>

          <Link href={roomsPath}>
            <div className={listReservationsStyle}>
              <MeetingRoomIcon fontSize="large" />
              <Typography variant="h6" className={classes.text}>
                Rooms
              </Typography>
            </div>
          </Link>

          <Link href="/reserves">
            <div className={reservesStyle}>
              <ListIcon fontSize="large" />
              <Typography variant="h6" className={classes.text}>
                Reservations
              </Typography>
            </div>
          </Link>
        </List>
      </div>
    </Drawer>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  text: {
    marginLeft: "15px",
  },
}));


export default Menu;