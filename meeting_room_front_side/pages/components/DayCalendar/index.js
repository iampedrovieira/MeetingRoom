import React, { Component, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "./calendar.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { getReservationsByDay } from "@/libs/Reservations.ts";

class DayCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responseError: false,
      reserves: [],
      position: new Date(),
      day: new Date(),
    };
  }

  async getReservations() {
    const [roomSelected, setRoomSelected] = this.props.value.roomSelected;
    const [date, setDate] = this.props.value.date;
    const officeid= this.props.value.officeId;
    if (date && roomSelected) {
      const result = await getReservationsByDay(roomSelected, date,officeid);
      console.log(result);
      if (result != null) {
        this.setState({
          reserves: result,
        });
      } else {
        this.setState({
          responseError: true,
        });
      }
    }
  }

  handleOnSelectEvent(event) {
    const user = this.props.value.user.userid;
    var userName =  this.props.value.user.username;
    
    if (event.title == userName && event.end > moment()) {
      this.props.value.clickEvent(event);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.value.roomSelected !== this.props.value.roomSelected ||
      prevProps.value.date !== this.props.value.date
    ) {
      this.getReservations();
    }
  }

  eventStyleGetter(event) {
    var userName =  this.props.value.user.username;

    if (event.title == userName ) {
      var style;
      if (event.end < moment()) {
        style = {
          backgroundColor: "#c6c5c5",
          border: "none",
        };
      } else {
        if (event.start < moment()) {
          style = {
            backgroundColor: "#008000",
            border: "none",
          };
        } else {
          style = {
            backgroundColor: "#457AB2",
            border: "none",
          };
        }
      }

      return {
        style: style,
      };
    } else {
      if (event.end < moment() && event.start < moment()) {
        var style = {
          backgroundColor: "#4ed34e",
          border: "none",
        };
      } else {
        var style = {
          backgroundColor: "#192A49",
          border: "none",
        };
      }
      var style = {
        backgroundColor: "#192A49",
        border: "none",
      };
      return {
        style: style,
      };
    }
  }

  render() {
    const localizer = momentLocalizer(moment);
    let dayToShow;
    let now = new Date();
    let hour = now.getHours();
    let reservesToDisplay = this.state.reserves.map((reserve) => {
      var title
      if(reserve.externalid.split(':')[1] == reserve.internalDomain){
        title = reserve.externalid.split(':')[0].split('@')[1]
      }else{
        if(!reserve.externalid.split(':')[1] && reserve.officeId.split('-')[1]){
          title = '@'+reserve.externalid+':'+reserve.officeId.split('-')[1]
        }else{
          title = reserve.externalid
        }
        
      }
      return {
        start: moment(reserve.initdate).toDate(),
        end: moment(reserve.enddate).toDate(),
        title: title,
        user: reserve.user.userid,
        reserve: reserve.reservationid,
        officeId:reserve.officeId,
        userName:reserve.externalid
      };
    });

    if (this.props.value == null) {
      dayToShow = moment();
    } else {
      dayToShow = moment(this.props.value.date[0]).toDate();
    }

    if (reservesToDisplay) {
      return (
        <Calendar
          localizer={localizer}
          date={dayToShow}
          onNavigate={() => {
            dayToShow;
          }}
          toolbar={false}
          events={reservesToDisplay}
          startAccessor="start"
          endAccessor="end"
          defaultView="day"
          min={moment("07:00am", "h:mma").toDate()}
          max={moment("20:00am", "h:mma").toDate()}
          timeslots={1}
          step={15}
          views={["day"]}
          style={{ height: "100%" }}
          onSelectEvent={(e) => this.handleOnSelectEvent(e)}
          scrollToTime={this.position}
          eventPropGetter={(event) => this.eventStyleGetter(event)}
        />
      );
    } else {
      return <p>Loading</p>;
    }
  }
}

export default DayCalendar;
