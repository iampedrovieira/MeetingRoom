import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import cookies from "next-cookies";
import axios from "axios";
import jwt from "jsonwebtoken";
import Menu from "../components/Menu-bar";
import Header from "../components/Header";
import LoadingPage from "../components/LoadingPage";
import ReservationLine from "../components/ReservationLine";
import {searchReservation} from '@/libs/Reservations'
import {sessionValidation} from "@/libs/Session"
import {getAllOffices} from '@/libs/Offices'

/** Material UI */
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import { AppProps } from "next/dist/next-server/lib/router/router";
import { GetServerSideProps } from "next";

export const Reserves = ({ user, offices }:AppProps) => {
  const router = useRouter();
  const [officeIdSelected, setOfficeIdSelected] = useState();
  const [listReservations, setListReservations] = useState([]);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  });

  useEffect(() => {
    if (user) {
      setOfficeIdSelected(user.defaultOffice);
    }
  }, [1]);

  useEffect(() => {
    if (user && officeIdSelected) {
      searchReservations();
    }
  }, [officeIdSelected]);

  if (!user) {
    return <LoadingPage />;
  }

  async function searchReservations() {
    var result
    if(isNaN(officeIdSelected)){
      result = await searchReservation(user.username,officeIdSelected)
    }else{
      result = await searchReservation(user.userid,officeIdSelected)
    }
    
    if(result){
      console.log(result)
      setListReservations(result);
    }else{
      setListReservations([]);
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header
        user={user}
        offices={offices}
        office={officeIdSelected}
        setOffice={setOfficeIdSelected}
      />
      <Menu />

      <main className={classes.content}>
        <div className={classes.container}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Room</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {listReservations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((reservation) => (
                    <ReservationLine reservations={reservation} refresh={searchReservations}/>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5]}
            component='div'
            count={listReservations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps:GetServerSideProps = async (context) =>  {
  //Get token from cookies
  const { token } = cookies(context);
  const result = await sessionValidation(token)
  if (result){
    const offices = await getAllOffices()
    const json_user = jwt.decode(token);
      return {
          props: {
            user: json_user,
            offices: offices,
          },
        };
  }else{
    return {
      props: {},
    };
  }
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
    marginTop: "5rem",
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  container: {
    width: "85%",
    background: "#ffffff",
  },
}));

export default Reserves;
