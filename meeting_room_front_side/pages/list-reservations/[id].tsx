import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {sessionValidation,User} from "@/libs/Session"
import {getRoomByOffice} from "@/libs/Rooms"
import {getAllOffices} from "@/libs/Offices"
import {CookieDocument} from '@/libs/Types'

import cookies from "next-cookies";
import jwt from "jsonwebtoken";
import DatePicker from "react-datepicker";
import Header from "../components/Header";
import Menu from "../components/Menu-bar";
import Room from "../components/Room";
import DayCalendar from "../components/DayCalendar";
import EventOpen from "../components/EventOpen";
import List from "@material-ui/core/List";
import LoadingPage from "../components/LoadingPage";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Typography } from "@material-ui/core";
import { GetStaticPaths, GetStaticProps } from "next";
import { off } from "node:process";

export const ListReservations = ({officeID, offices, rooms }) => {
  const classes = useStyles();
  const router = useRouter();
  const [officeIdSelected, setOfficeIdSelected] = useState(officeID);
  const [roomList, setRoomList] = useState([]);
  const [date, setDate] = useState(new Date());
  const [roomSelected, setRoomSelected] = useState();
  const [officeList, setOfficeList] = useState([]);
  const [user, setUser] = useState<User>();
  const [openEvent,setOpenEvent] = useState(false)
  const [selectedEvent,setSelectedEvent] = useState();

  
  // Session verification when page is load first time
  useEffect(() => {
    const validation = async () => {
      const {token} = cookies(document as CookieDocument)
      const result = await sessionValidation(token);
      if (!result) {
        router.push("/login");
      }else{
        const json_user = jwt.decode(token,{json:true}) as User;
        setUser(json_user);
      }
    };
    validation();
    /* setOfficeIdSelected(user.defaultOffice); */
    setOfficeList(offices);
    setRoomList(rooms);
  }, [1]);

  //Run when pageProps(rooms) change
  useEffect( () => {
    setRoomList(rooms);
  }, [rooms]);

  //Run when officeIdSelected change
  useEffect(() => {
    if (officeIdSelected) {
      router.push("/list-reservations/" + officeIdSelected);
    }
  }, [officeIdSelected]);


  function clickEvent(event){
    setOpenEvent(true)
    setSelectedEvent(event)
  }


  if (!user) {
    return <LoadingPage />;
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <EventOpen open={openEvent} setOpen={setOpenEvent} event={selectedEvent}/>
      <Header
        user={user}
        offices={officeList}
        office={officeIdSelected}
        setOffice={setOfficeIdSelected}
      />

      <Menu />
      <main className={classes.content}>
        <div className={classes.container}>
          <div className={classes.roomListContainer}>
            <Typography variant="h5">
              Date
            </Typography>
            <DatePicker
              className={classes.datepicker}
              selected={date}
              onChange={(date) => {
                setDate(date);
              }}
              dateFormat="dd-MM-yyyy"
            ></DatePicker>

            <div className={classes.roomList}>
              <List>
                {roomList.map((room) => (
                  <div
                    key={room.roomid}
                    onClick={() => setRoomSelected(room.roomid)}
                  >
                    <Room
                      room={room}
                      roomSelected={roomSelected}
                      setRoom={setRoomSelected}
                      key={room.roomid}
                    />
                    <Divider />
                  </div>
                ))}
              </List>
            </div>
          </div>
          <div className={classes.reservationList}>
            <DayCalendar
              value={{
                roomSelected: [roomSelected, setRoomSelected],
                date: [date, setDate],
                user : user,
                officeId:officeIdSelected,
                clickEvent:clickEvent
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

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
    marginTop: "5rem",
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  container: {
    display: "flex",
    width: "100%",
  },
  roomListContainer: {
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: "15px",
    borderBottomLeftRadius: "15px",
    color: "#ffffff",
    flex: 1,
    padding: theme.spacing(3),
  },
  datepicker: {
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    outline: "none",
    padding: theme.spacing(1),
  },
  roomList: {
    background: "var(--primary-background-color)",
    borderRadius: "10px",
    marginTop: "5%",
    color: "#000000",
    overflow: "auto",
    maxHeight: "85%"
  },
  reservationList: {
    width: "70%",
    backgroundColor: "var(--primary-background-color)",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    padding: theme.spacing(2),
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
  },
}));

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
export default ListReservations;