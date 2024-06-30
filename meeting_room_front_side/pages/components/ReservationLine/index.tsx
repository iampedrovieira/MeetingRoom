import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import moment from "moment";
import { deleteReservations } from "@/libs/Reservations";
/** Material UI */
import { makeStyles } from "@material-ui/core/styles";
import { TableCell, TableRow, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

export const ReservationLine = (props) => {
  const classes = useStyles();
  const [initDate, setInitDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [name, setName] = useState();
  const [reservationID, setReservationID] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const [buttonStyle, setButtonStyle] = useState(classes.deleteButton);

  useEffect(() => {
    if (props.reservations) {
      const iniDate = props.reservations.initdate.split("T")[0];
      const iniTime = props.reservations.initdate.split("T")[1].split(".")[0];
      const endDate = props.reservations.enddate.split("T")[0];
      const endTime = props.reservations.enddate.split("T")[1].split(".")[0];
      setInitDate(
        iniDate + " " + iniTime.split(":")[0] + ":" + iniTime.split(":")[1]
      );
      setEndDate(
        endDate + " " + endTime.split(":")[0] + ":" + endTime.split(":")[1]
      );
      setName(props.reservations.room._name);
      setReservationID(props.reservations.reservationid);
      if (moment() > moment(props.reservations.initdate)) {
        setButtonStyle(classes.deleteButtonDisable);
      } else {
        setButtonStyle(classes.deleteButton);
      }
    }
  });

  async function handleDelete() {
    if (moment() > moment(props.reservations.initdate)) {
      console.log("erro pela data passada")
      console.log(moment(props.reservations.initdate))
      enqueueSnackbar("Cannot delete reservation", {
        variant: "error",
      });
    } else {
      console.log(props.reservations)
      const result = await deleteReservations(props.reservations.reservationid,props.reservations.externalid,props.reservations.officeid);
      if (result) {
        props.refresh()
        enqueueSnackbar("Reservation Deleted", {
          variant: "success",
        });
      } else {
        console.log("erro pelo pedido")
        console.log(result)
        enqueueSnackbar("Cannot delete reservation", {
          variant: "error",
        });
      }
    }
  }

  return (
    <TableRow className={classes.line}>
      <TableCell>{name}</TableCell>
      <TableCell>{initDate}</TableCell>
      <TableCell>{endDate}</TableCell>
      <TableCell>
        <IconButton
          aria-label="delete"
          onClick={handleDelete}
          className={buttonStyle}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

const useStyles = makeStyles((theme) => ({
  line: {
    width: "100%",
  },
  deleteButton: {
    background: theme.palette.error.main,
    color: "#ffffff",
  },
  deleteButtonDisable: {
    display: "disable",
    background: "#white",
    color: "#c6c5c5",
  },
}));

export default ReservationLine;