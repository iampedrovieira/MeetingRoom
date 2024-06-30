import React from "react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { finishReservations, deleteReservations } from "@/libs/Reservations";
import { AppProps } from "next/dist/next-server/lib/router/router";
/** Material UI */
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
/** Icons */
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";

export const EventOpen = (props) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState();
  const [reserveId, setReserveId] = useState();
  const [userName, setUserName] = useState();
  const [officeId, setOfficeId] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  function handleClose() {
    props.setOpen(false);
  }

  async function handleDelete() {
    //Cancelar a reserva
    console.log("officeid -> "+officeId)
    const result = await deleteReservations(reserveId,userName,officeId);
    if (result) {
      props.setOpen(false);
      enqueueSnackbar("Reservation Deleted", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Cannot delete reservation", {
        variant: "error",
      });
    }
  }

  async function handleFinish() {
    const result = await finishReservations(reserveId);
    if (result) {
      props.setOpen(false);
      enqueueSnackbar("Reservation finished", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Cannot finish reservation", {
        variant: "error",
      });
    }
  }

  useEffect(() => {
    if (props.event) {
      setOpen(props.open);
      const init = moment(props.event.start).format("hh:mm A");
      const end = moment(props.event.end).format("hh:mm A");
      //setTitle(init + " - " + end);
      setReserveId(props.event.reserve);
      setOfficeId(props.event.officeId)
      setUserName(props.event.userName);

    }
  });

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={props.changeOpen}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>

      <DialogContent>
        <Button
          variant="contained"
          size="large"
          disableElevation
          aria-label="delete"
          onClick={handleDelete}
          className={classes.deleteButton}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>

        <Button
          variant="contained"
          size="large"
          disableElevation
          aria-label="delete"
          onClick={handleFinish}
          className={classes.finishButton}
          startIcon={<DoneIcon />}
        >
          Finished
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="text">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  deleteButton: {
    background: theme.palette.error.main,
    margin: theme.spacing(1),
    color: "#ffffff",
  },
  finishButton: {
    background: theme.palette.secondary.main,
    margin: theme.spacing(1),
    color: "#ffffff",
  },
}));

export default EventOpen;