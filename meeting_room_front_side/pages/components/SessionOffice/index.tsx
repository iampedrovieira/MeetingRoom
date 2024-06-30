import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import Container from "@material-ui/core/Container";
import BusinessIcon from "@material-ui/icons/Business";
import { useSnackbar } from "notistack";
import cookies from "next-cookies";
import {DateFormat,FormatedDate,TimeFormat,CookieDocument} from '@/libs/Types'
import {changeOfficeSession, User} from "@/libs/Session"

export const SessionOffice = (props) => {
  const [selectedOffice, setSelectedOffice] = useState<any>();
  const [officeList, setOfficeList] = useState([]);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (props.offices) {
      const { token } = cookies(document as CookieDocument);
      const json_token = jwt.decode(token, {json: true});
      setOfficeList(props.offices);
      setSelectedOffice(json_token.defaultOffice);
    }
  }, [1]);

  async function changeOffice(newOffice) {
    const { token } = cookies(document as CookieDocument);
    const response = await changeOfficeSession(token,newOffice)
    
    if(response.status==200){
      const newToken:User = jwt.decode(response.data.token) as User
      console.log(newToken)
      props.setOffice(newToken.defaultOffice);
      document.cookie = "token =" + response.data.token;
      enqueueSnackbar("Office changed", {
        variant: "success",
      });
      }
  }
  return (
    <Container className={classes.container} fixed>
      <BusinessIcon />
      <Select
        className={classes.select}
        inputProps={{
          classes: {
            icon: classes.icon,
          },
        }}
        id="select"
        native
        value={selectedOffice}
        onChange = {(u) => {
          setSelectedOffice(u.target.value);
          changeOffice(u.target.value);
        }}
      >
        {officeList.map((office) => (
          <option value={office.officeid} key={office.officeid}>
            {office.description}
          </option>
        ))}
      </Select>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    border: "3px solid var(--primary-background-color)",
    borderRadius: "10px",
  },
  icon: {
    fill: "var(--primary-background-color)",
  },
  select: {
    "&:before": {
      border: "none",
    },
    "&:after": {
      borderColor: "var(--primary-background-color)",
    },
    "&:not([multiple]) option": {
      backgroundColor: "var(--primary-background-color)",
      color: "var(--primary-color)",
    },
    color: "var(--primary-background-color)",
    background: "var(--primary-color)",
    marginLeft: "6px",
  },
}));

export default SessionOffice;