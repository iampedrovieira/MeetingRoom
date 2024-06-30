import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import cookies from "next-cookies";

import { sessionValidation,User} from "@/libs/Session";
import { FreeRoom, getFreeRooms } from "@/libs/Rooms";
import { createReservations, deleteReservations } from "@/libs/Reservations";
import { getRoomByOffice } from "@/libs/Rooms";
import { getAllOffices } from "@/libs/Offices";
import {DateFormat,FormatedDate,TimeFormat,CookieDocument} from '@/libs/Types'
import jwt from "jsonwebtoken";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import Menu from "../components/Menu-bar";
import Header from "../components/Header";
import Room from "../components/Room";
/*  Material UI */
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import LoadingPage from "../components/LoadingPage";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";
import { useSnackbar } from "notistack";
import { Fragment } from 'react'
import { GetStaticPaths, GetStaticProps } from "next";



export const Reservation = ({ officeID, offices, rooms }) => {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [officeIdSelected, setOfficeIdSelected] = useState(officeID);
  const [officeList, setOfficeList] = useState([]);
  const [roomIdSelected, setRoomIdSelected] = useState(-1);
  const [roomListAvailable, setRoomListAvailable] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const classes = useStyles();

  // Session verification when page is load first time
  useEffect(() => {
    const validation = async () => {
      const { token } = cookies(document as CookieDocument);
      const result = await sessionValidation(token);
      if (!result) {
        router.push("/login");
        //Create a static rooms and showRooms
      } else {
        const json_user = jwt.decode(token,{json:true}) as User;
        setUser(json_user);
        autoFillTime();
        //setAvailable rooms
        if (timeIsValid(startTime, endTime)&&user) {
          searchRooms();
        }
      }
    };
    validation();
    setOfficeList(offices);
  }, [1]);

  //Run when pageProps (rooms) change
  useEffect(() => {
    setRoomListAvailable([])
    //setAvailable rooms where
    if (timeIsValid(startTime, endTime)&&user) {
      searchRooms();
    }
  }, [rooms]);

  //Run when officeIdSelected change
  useEffect(() => {
    if (officeIdSelected) {
      router.push("/reservation/" + officeIdSelected);
      setRoomListAvailable([])
    }
  }, [officeIdSelected]);

  useEffect(() => {
    //Load rooms when office or startTime or endTime are changed
    if (officeIdSelected) {
      //setAvailable rooms where
      if (timeIsValid(startTime, endTime)&& user) {
        searchRooms();
        setRoomIdSelected(-1);
      } else {
        setRoomListAvailable([]);
      }
    }
  }, [startTime, endTime, date]);

  const handleClickRoom = () => {
    setOpen(!open);
  };

  if (!user) {
    return <LoadingPage />;
  }

  function formatDateToString():FormatedDate {
    const format_start_time =startTime.getHours() + ":" + startTime.getMinutes() as TimeFormat;
    const format_end_time = (endTime.getHours() + ":" + endTime.getMinutes()) as TimeFormat ;
    const format_date = (date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear()) as DateFormat;
    
    const res = {} as FormatedDate;
    res.format_start_time=format_start_time;
    res.format_end_time=format_end_time;
    res.format_date = format_date;
    
    return res;
  }

  function timeIsValid(start, end) {
    if (start != null && end != null) {
      const startHour = start.getHours();
      const startMinute = start.getMinutes();

      const endHour = end.getHours();
      const endMinute = end.getMinutes();

      const format_date =
        date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();
      const start_date = new Date(
        format_date + " " + startHour + ":" + startMinute
      );
      const end_date = new Date(format_date + " " + endHour + ":" + endMinute);
      const current_date = new Date();

      if (
        start_date.getTime() >= end_date.getTime() ||
        (start_date.getTime() < current_date.getTime() && date <= current_date)
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  function autoFillTime() {
    //AutoFill Timer
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    var start = new Date();
    var end = new Date();

    //The setEndTime is optional, in the future maybe put it wiih AI
    if (hour < 6 || hour > 19) {
      setStartTime(new Date(0, 0, 0, 7, 0));
      setEndTime(new Date(0, 0, 0, 7, 15));
      if (hour > 19 && hour <= 23) {
        const today = new Date();
        setDate(
          new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        );
      }
    } else {
      if (minute < 15) {
        setStartTime(new Date(0, 0, 0, hour, 15));
        setEndTime(new Date(0, 0, 0, hour, 30));
      } else {
        if (minute < 30) {
          setStartTime(new Date(0, 0, 0, hour, 30));
          setEndTime(new Date(0, 0, 0, hour, 45));
        } else {
          if (minute < 45) {
            setStartTime(new Date(0, 0, 0, hour, 45));
            setEndTime(new Date(0, 0, 0, hour + 1, 0));
          } else {
            if (hour == 19) {
              setStartTime(new Date(0, 0, 0, 7, 0));
              setEndTime(new Date(0, 0, 0, 7, 15));
              const today = new Date();
              setDate(
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() + 1
                )
              );
            } else {
              setStartTime(new Date(0, 0, 0, hour + 1, 0));
              setEndTime(new Date(0, 0, 0, hour + 1, 15));
            }
          }
        }
      }
    }
  }

  function onChangeDate(newDate) {
    const today = new Date();
    const actualDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    );

    if (newDate < actualDate) {
      enqueueSnackbar("Cannot select past day", {
        variant: "warning",
      });

      return;
    } else {
      setDate(newDate);
    }
  }

  async function searchRooms() {
    const formated:FormatedDate = formatDateToString();
    //Rooms from selectd office
    console.log(user)
    const freeRooms:Array<FreeRoom> = await getFreeRooms(
      formated.format_date,
      formated.format_start_time,
      formated.format_end_time,
      officeIdSelected,
      user.username
    );
    if (freeRooms.length == 0) {
      enqueueSnackbar("No rooms free", {
        variant: "info",
      });
    }
    var roomsToAdd:Array<JSON> = []

    for(const freeRoom of freeRooms){
        for(const room of rooms){
          if(freeRoom.roomid == room.roomid){
            roomsToAdd.push(room)
          }
        }
    }
    setRoomListAvailable(roomsToAdd);
  }

  async function handleSumbit() {
    if (!timeIsValid(startTime, endTime)) {
      enqueueSnackbar("Invalid times", {
        variant: "warning",
      });

      return;
    }
    const formated:FormatedDate = formatDateToString();

    try {
      const response_reservation = await createReservations(
        formated.format_start_time,
        formated.format_end_time,
        formated.format_date,
        roomIdSelected,
        user.userid,
        officeIdSelected,
        user.level,
        user.username);

      if (response_reservation.status == 201) {

        const action = key => (
          <Fragment>
            <Button onClick={async () => { await deleteReservations(response_reservation.data.reservationid,user.username,officeIdSelected);closeSnackbar(key); searchRooms(); }}>
              UNDO
              </Button>
          </Fragment>
        );
        console.log(response_reservation.data)
        if (response_reservation.data.roomname != "") {
          enqueueSnackbar(
            "Reserved in room " + response_reservation.data.roomname,
            {
              variant: "success",
              action
            }
          );
        } else {
          enqueueSnackbar("Reserved", {
            variant: "success",
            action
          });
        }
        ;
        searchRooms();
      } else {
        if (response_reservation.data.message) {
          enqueueSnackbar(response_reservation.data.message, {
            variant: "warning",
          });
        }

        searchRooms();
      }
    } catch (error) { }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header
        user={user}
        offices={officeList}
        office={officeIdSelected}
        setOffice={setOfficeIdSelected}
      />
      <Menu />
      <main className={classes.content}>
        <div className={classes.form_container}>
          <div className={classes.form_date_select}>
            <Typography variant="h5">Date</Typography>
            <DatePicker
              className={classes.datepicker}
              selected={date}
              onChange={(date) => {
                onChangeDate(date);
              }}
              dateFormat="dd-MM-yyyy"
            />
          </div>

          <div className={classes.form_time}>
            <div className={classes.form_time_start}>
              <Typography variant="h6">Start Time</Typography>
              <DatePicker
                className={classes.timepicker}
                selected={startTime}
                onChange={(date) => {
                  setStartTime(date);
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                minTime={setHours(setMinutes(new Date(), 0), 7)}
                maxTime={setHours(setMinutes(new Date(), 45), 19)}
              />
            </div>

            <div className={classes.form_time_end}>
              <Typography variant="h6">End Time</Typography>
              <DatePicker
                className={classes.timepicker}
                selected={endTime}
                onChange={(date) => {
                  setEndTime(date);
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                minTime={setHours(setMinutes(new Date(), 15), 7)}
                maxTime={setHours(setMinutes(new Date(), 0), 20)}
              />
            </div>
          </div>

          <br />
          <br />

          <div className={classes.buttonDiv}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSumbit}
              disableRipple
              style={{
                // display: "block",
                width: "80%",
                height: "2.5rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Reserve
            </Button>

            <Tooltip
              className={classes.info}
              title="If you don't select any room, one can be selected for you based on previous reservations."
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 200 }}
            >
              <InfoOutlinedIcon />
            </Tooltip>
          </div>

          <div className={classes.rooms}>
            <List className={classes.list} onClick={handleClickRoom}>
              <ListItem button onClick={handleClickRoom}>
                <ListItemIcon>
                  <Typography variant="h5">Rooms</Typography>
                </ListItemIcon>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {roomListAvailable.map((room) => (
                    <div key={room.roomid}>
                      <Room
                        room={room}
                        roomSelected={roomIdSelected}
                        setRoom={setRoomIdSelected}
                        key={room.roomid}
                      />
                      <Divider />
                    </div>
                  ))}
                </List>
              </Collapse>
            </List>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticPaths:GetStaticPaths =async ()=> {
  const json_office = await getAllOffices();
  const officeList = await getAllOffices();
  var cleanOffice = []
    for(const i of officeList){
      var exist = false
      for(const j of cleanOffice){
        if(i.officeid == j.officeid){
          exist = true
        }
      }
      if(!exist){
        cleanOffice.push(i)
      }
    }
  const paths = json_office.map((office) => {
    return { params: { id: String(office.officeid) } };
  });
  return {
    paths: paths,
    fallback: false,
  };
}

//This run on build
export const getStaticProps:GetStaticProps = async (context)=> {
  const officeId = context.params.id;
  const officeList = await getAllOffices();
  var cleanOffice = []
    for(const i of officeList){
      var exist = false
      for(const j of cleanOffice){
        if(i.officeid == j.officeid){
          exist = true
        }
      }
      if(!exist){
        cleanOffice.push(i)
      }
    }
  const roomList = await getRoomByOffice(officeId);
  
  return {
    props: {
      officeID: officeId,
      offices: cleanOffice,
      rooms: roomList,
    },
  };
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "auto",
    maxHeight: "100%",
    width: "100%",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    marginTop: "8rem",
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  form_container: {
    display: "flex",
    flexDirection: "column",
    width: "30%",
    height: "auto",
    minWidth: "240px",
    minHeight: "400px",
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    padding: theme.spacing(2),
    borderRadius: "25px",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  },
  form_date_select: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  datepicker: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    padding: "5px",
    border: "none",
    outline: "none",
  },
  form_time: {
    width: "100%",
    marginTop: "20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  timepicker: {
    width: "80%",
    minWidth: "70px",
    padding: "5px",
    paddingLeft: "5px",
    border: "none",
    marginTop: "5px",
    outline: "none",
  },
  form_time_start: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  form_time_end: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  buttonDiv: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  info: {
    marginRight: "3%",
  },
  rooms: {
    marginTop: "3rem",
    width: "100%",
    maxHeight: "19rem",
    background: "var(--primary-background-color)",
    overflow: "auto",
  },
  list: {
    textAlign: "center",
    padding: "0px",
  },
}));

export default Reservation;