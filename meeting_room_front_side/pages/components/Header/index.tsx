import React from "react";
import SessionOffice from "../SessionOffice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Fade from "@material-ui/core/Fade";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";

export const Header = (props) => {
  const router = useRouter();
  const [name, setName] = useState("name");
  const [existUser, setExistUser] = useState(false);
  //Material UI
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleLogout() {
    document.cookie = "token =";
    router.push("/login");
  }

  useEffect(() => {
    if (props.user) {
      setName(props.user.name);
      setExistUser(true);
    }
  });

  useEffect(() => {
    if (props.user) {
      setName(props.user.name);
    }
  });

  //Naterial UI
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      className={classes.menu}
      id="fade-menu"
      anchorEl={anchorEl}
      keepMounted
      TransitionComponent={Fade}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";

  //Edit in Future [Mobile Layout]
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <SessionOffice></SessionOffice>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  //-------

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Accenture
          </Typography>
          <Typography className={classes.title} variant="h6" noWrap>
            Space Request
          </Typography>
          <div className={classes.grow} />
          {existUser && (
            <div>
              <div className={classes.sectionDesktop}>
                <div className={classes.office}>
                  <SessionOffice
                    offices={props.offices}
                    office={props.office}
                    setOffice={props.setOffice}
                  />
                </div>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Typography className={classes.name} variant="h6">
                    {name}
                  </Typography>
                  <AccountCircle />
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    margin: "0px 0px 0px 110px",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },

  menu: {
    marginTop: "3rem",
    marginLeft: "5rem",
  },
  logo: {},
  name: {
    marginRight: "1rem",
    fontSize: "70%",
  },
  office: {
    marginRight: "5rem",
    height: "100%",
    margin: "0.8rem",
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      width: "5re",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default Header;
