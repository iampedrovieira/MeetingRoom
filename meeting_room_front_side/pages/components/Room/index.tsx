import styles from "./room.module.css";
import { useEffect, useState } from "react";
/** Material UI */
import { makeStyles } from "@material-ui/core/styles";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import EventSeatOutlinedIcon from "@material-ui/icons/EventSeatOutlined";
import TvIcon from "@material-ui/icons/Tv";
import PhoneIcon from "@material-ui/icons/Phone";
import HeadsetMicIcon from "@material-ui/icons/HeadsetMic";
import MicIcon from "@material-ui/icons/Mic";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import ComputerIcon from "@material-ui/icons/Computer";

export const Room = (props) => {
  const [name, setName] = useState();
  const [value, setValue] = useState();
  const [seats, setSeats] = useState();
  const [componentStyle, setComponentStyle] = useState<string>();

  const [tv, setTv] = useState(false);
  const [phone, setPhone] = useState(false);
  const [headSet, setHeadSet] = useState(false);
  const [mic, setMic] = useState(false);
  const [camera, setCamera] = useState(false);
  const [computer, setComputer] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (props.room) {
      setName(props.room._name);
      setSeats(props.room.seats);
      setValue(props.room.roomid);

      const materials = props.room.materials;
      //Falta colocar a atribuição dos materiais.
      if (materials.length > 0) {
        materials.forEach((material) => {
          switch (material._name) {
            case "TV":
              setTv(true);
              break;
            case "microphone":
              setMic(true);
              break;
            case "Headset":
              setHeadSet(true);
              break;
            case "Camera":
              setCamera(true);
              break;
            case "Computer":
              setComputer(true);
              break;
            case "phone":
              setPhone(true);
              break;
          }
        });
        setTv(true);
      }

      if (value === props.roomSelected) {
        setComponentStyle(classes.container_selected);
      } else {
        setComponentStyle(classes.container_usSelected);
      }
    }
  }, [1]);

  useEffect(() => {
    if (props.room) {
      if (value === props.roomSelected) {
        setComponentStyle(classes.container_selected);
      } else {
        setComponentStyle(classes.container_usSelected);
      }
    }
  });

  function handleClick() {
    props.setRoom(value);
  }

  return (
    <ListItem
      button
      className={componentStyle}
      //fixed
      onClick={handleClick}
      disableRipple
    >
      <div className={classes.info}>
        <MeetingRoomIcon className={classes.roomIcon} />
        <Typography variant="subtitle1">{name}</Typography>
      </div>

      <div className={classes.icons}>
        <Typography variant="subtitle2">{seats}</Typography>
        <EventSeatOutlinedIcon fontSize="small" />
        {tv && <TvIcon fontSize="small" />}
        {headSet && <HeadsetMicIcon fontSize="small" />}
        {phone && <PhoneIcon fontSize="small" />}
        {mic && <MicIcon fontSize="small" />}
        {camera && <CameraAltIcon fontSize="small" />}
        {computer && <ComputerIcon fontSize="small" />}
      </div>
    </ListItem>
  );
}

const useStyles = makeStyles((theme) => ({
  container_selected: {
    background: theme.palette.secondary.main,
    padding: "1%",
    marginBottom: "3px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  container_usSelected: {
    background: theme.palette.background.default,
    padding: "1%",
    marginBottom: "3px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  info: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "0.4rem",
  },
  roomIcon: {
    height: "1rem",
    marginRight: "0.3rem",
  },
  icons: {
    "& :nth-child(2)": {
      paddingLeft: "0.1rem",
    },
    "& :nth-child(3)": {
      paddingLeft: "0.5rem",
    },
    "& *": {
      paddingLeft: "0.3rem",
    },
    display: "flex",
    flexDirection: "row",
    marginLeft: "1rem",
    alignItems: "center",
  },
}));

// const useStyles = makeStyles((theme) => ({
//   container_selected: {
//     background: theme.palette.secondary.main,
//     padding: "1%",
//     marginBottom: "3px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "flex-start",
//   },
//   container_usSelected: {
//     background: theme.palette.background,
//     padding: "1%",
//     marginBottom: "3px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "flex-start",
//   },
//   info: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     marginLeft: "0.4rem",
//   },
//   roomIcon: {
//     height: "1rem",
//     marginRight: "0.3rem",
//   },
//   icons: {
//     "& :nth-child(2)": {
//       paddingLeft: "0.1rem",
//     },
//     "& :nth-child(3)": {
//       paddingLeft: "0.5rem",
//     },
//     "& *": {
//       paddingLeft: "0.3rem",
//     },
//     display: "flex",
//     flexDirection: "row",
//     marginLeft: "1rem",
//     alignItems: "center",
//   },
// }));

export default Room;