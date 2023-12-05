/* eslint-disable react-hooks/exhaustive-deps */
// Library Imports
import React, { useEffect, useState } from "react";
import useTheme from "@mui/material/styles/useTheme";
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";


import {
  darkGray,
  secondaryColor,
  primaryColor,
  dark,
  iconStyling1,
} from "../../../helpers/GlobalVariables";
import {
  dashboardRoutes,
  provisionAccHolderRoutes,
  superAdminRoutes,
} from "../../../routes/routes";
import "./Layout.css";
import { Switch, Typography } from "../../../shared"
import { isUserAuthenticated } from "../../../helpers/GlobalMethods";
import AssetsImages from "../../../assets/images";
import AccountMenu from "./AccountMenu";
import * as Actions from "../../../redux/administration/actions";
import * as Selectors from "../../../redux/administration/selectors";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 20px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 20px)`,
  },
});

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),

//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
// }));

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(!open && {
//     width: `calc(94.9% )`,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  // zIndex: 9999,
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  // const [user, setUser] = useState({});
  const user = useSelector((state) => state.user.currentUser);

  const collapse = Selectors.GetCollapse();
  const [open, setOpen] = useState(collapse);
  const routes = Selectors.GetRoutes();
  const [listOpen, setListOpen] = useState(routes);

  useEffect(() => {
    // let user = getUserDetails();
    if (!isUserAuthenticated()) {
      navigate("/");
      return;
    }

    // setUser(currentUser || propsUser);
  }, []);

  const isUserAuthorized = () => {
    if (
      location.pathname === "/" ||
      location.pathname === "/forgot-password" ||
      location.pathname === "/authenticate" ||
      location.pathname === "/reset-password" ||
      location.pathname === "/request-sent" ||
      location.pathname === "/reset-successfully"
    ) {
      return;
    }
    return;
  };
  useEffect(() => {
    isUserAuthorized();
  });

  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(Actions.setCollapse(!open));
  };

  const handleClickForParent = (obj) => {
    // If Drawer Not Open
    if (!open) {
      obj.childs.length === 0 && navigate(obj.path);
      if (obj.childs.length > 0) {
        navigate(obj.path);
      }
    }
    // If Drawer Open
    else {
      obj.childs.length === 0 && navigate(obj.path);
      if (obj.childs.length > 0) {
        setListOpen({
          ...listOpen,
          [obj.text]: !listOpen[obj.text],
        });
        dispatch(
          Actions.setRoutes({
            ...listOpen,
            [obj.text]: !listOpen[obj.text],
          })
        );
      }
    }
  };

  const handleClickForChild = (child) => {
    navigate(child.path);
  };

  return (
    isUserAuthenticated() && (
      <Box>
        <CssBaseline />

        <Drawer variant="permanent" open={open}>
          <div
            className="flex my-4 mx-[23px]"
            style={{
              minWidth: 48,
            }}>
            <div className={`logo-wrapper-drawer`}>
              <Link
                className="d-flex flex-row justify-end align-items-center"
                to={
                  user.role === "super-admin"
                    ? "/manage-accounts"
                    : "/dashboard"
                }>
                <img
                  className="w-10 h-10"
                  alt="shift-erp"
                  src={AssetsImages.shiftErpIcon}
                />
                {open && (
                  <Typography
                    className="text-black fs-5 ms-3"
                    variant="h1"
                    fontSize={13}
                    fontWeight="medium">
                    ShiftERP
                  </Typography>
                )}
              </Link>
            </div>
          </div>

          <List
          className="h-full flex flex-col justify-between">
            <div>
              {user.role === "super-admin"
                ? superAdminRoutes.map((item, index) => {
                    return (
                      <>
                        {/* Super Admin View */}
                        <div
                          className="px-2.5"
                          key={index}>
                          <ListItemButton
                            onClick={() => handleClickForParent(item)}
                            className={
                              listOpen[item.text]
                                ? location.pathname.substring(
                                    1,
                                    location.pathname.lastIndexOf("/")
                                  ) ===
                                    item.path.substring(
                                      1,
                                      item.path.lastIndexOf("/")
                                    ) && "active"
                                : location.pathname === item.path && "active"
                            }
                            sx={{
                              minHeight: 45,
                              width: open ? "100%" : "70%",
                              justifyContent: open ? "initial" : "center",
                              marginLeft: open ? 0 : 1.2,
                            }}>
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                              }}>
                              {listOpen[item.text]
                                ? location.pathname.substring(
                                    1,
                                    location.pathname.lastIndexOf("/")
                                  ) ===
                                  item.path.substring(
                                    1,
                                    item.path.lastIndexOf("/")
                                  )
                                  ? item.iconActive
                                  : item.icon
                                : location.pathname === item.path
                                ? item.iconActive
                                : item.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.text}
                              sx={{ opacity: open ? 1 : 0 }}
                              primaryTypographyProps={{
                                fontSize: 13,
                                fontWeight: "medium",
                                color: listOpen[item.text]
                                  ? location.pathname.substring(
                                      1,
                                      location.pathname.lastIndexOf("/")
                                    ) ===
                                      item.path.substring(
                                        1,
                                        item.path.lastIndexOf("/")
                                      ) && "primary"
                                  : location.pathname === item.path &&
                                    "primary",
                              }}
                            />
                          </ListItemButton>
                        </div>
                      </>
                    );
                  })
                : user.role === "company_admin" && user.provision_account_id > 0
                ? provisionAccHolderRoutes.map((item, index) => {
                    return (
                      <>
                        {/* Provision Account Holder View */}
                        <div
                          className="px-2.5"
                          key={index}>
                          <ListItemButton
                            onClick={() => handleClickForParent(item)}
                            className={
                              listOpen[item.text]
                                ? location.pathname.substring(
                                    1,
                                    location.pathname.lastIndexOf("/")
                                  ) ===
                                    item.path.substring(
                                      1,
                                      item.path.lastIndexOf("/")
                                    ) && "active"
                                : location.pathname === item.path && "active"
                            }
                            sx={{
                              minHeight: 45,
                              width: open ? "100%" : "70%",
                              justifyContent: open ? "initial" : "center",
                              marginLeft: open ? 0 : 1.2,
                            }}>
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                              }}>
                              {listOpen[item.text]
                                ? location.pathname.substring(
                                    1,
                                    location.pathname.lastIndexOf("/")
                                  ) ===
                                  item.path.substring(
                                    1,
                                    item.path.lastIndexOf("/")
                                  )
                                  ? item.iconActive
                                  : item.icon
                                : location.pathname === item.path
                                ? item.iconActive
                                : item.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.text}
                              sx={{ opacity: open ? 1 : 0 }}
                              primaryTypographyProps={{
                                fontSize: 13,
                                fontWeight: "medium",
                                color: listOpen[item.text]
                                  ? location.pathname.substring(
                                      1,
                                      location.pathname.lastIndexOf("/")
                                    ) ===
                                      item.path.substring(
                                        1,
                                        item.path.lastIndexOf("/")
                                      ) && "primary"
                                  : location.pathname === item.path &&
                                    "primary",
                              }}
                            />
                            {item.childs.length > 0 &&
                              (listOpen[item.text] ? (
                                <ArrowDropUpRoundedIcon
                                  sx={{
                                    color: listOpen[item.text]
                                      ? location.pathname.substring(
                                          1,
                                          location.pathname.lastIndexOf("/")
                                        ) ===
                                        item.path.substring(
                                          1,
                                          item.path.lastIndexOf("/")
                                        )
                                        ? primaryColor
                                        : secondaryColor
                                      : secondaryColor,
                                    ...(!open && { display: "none" }),
                                  }}
                                  fontSize="small"
                                />
                              ) : (
                                <ArrowDropDownRoundedIcon
                                  sx={{
                                    color: listOpen[item.text]
                                      ? location.pathname.substring(
                                          1,
                                          location.pathname.lastIndexOf("/")
                                        ) ===
                                          item.path.substring(
                                            1,
                                            item.path.lastIndexOf("/")
                                          ) && primaryColor
                                      : secondaryColor,
                                    ...(!open && { display: "none" }),
                                  }}
                                  fontSize="small"
                                />
                              ))}
                          </ListItemButton>
                          <div
                            className={`${
                              item.childs.length && "mx-4 border-l-2 mt-1"
                            }`}>
                            {item.childs.map((child, index1) => (
                              <div key={index1}>
                                {open && (
                                  <Collapse
                                    in={listOpen[item.text]}
                                    timeout="auto"
                                    unmountOnExit>
                                    <List component="div" disablePadding>
                                      <ListItemButton
                                        className={`${
                                          location.pathname === child.path
                                            ? "active"
                                            : null
                                        } left-6 w-[155px]`}
                                        sx={{ mt: 0.7 }}
                                        onClick={() =>
                                          handleClickForChild(child)
                                        }>
                                        <ListItemText
                                          primary={child.text}
                                          primaryTypographyProps={{
                                            fontSize: 13,
                                            fontWeight: "medium",
                                            color:
                                              location.pathname === child.path
                                                ? "primary"
                                                : darkGray,
                                          }}
                                          className="sm:ml-0 ml-1"
                                        />
                                      </ListItemButton>
                                    </List>
                                  </Collapse>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })
                : dashboardRoutes.map((item, index) => {
                    return (
                      <>
                        {/* Dashboard View */}
                        <div
                        className="px-2.5"
                          key={index}>
                          <ListItemButton
                            onClick={() => handleClickForParent(item)}
                            className={
                              listOpen[item.text]
                                ? location.pathname.substring(
                                    1,
                                    location.pathname.lastIndexOf("/")
                                  ) ===
                                    item.path.substring(
                                      1,
                                      item.path.lastIndexOf("/")
                                    ) && "active"
                                : location.pathname === item.path && "active"
                            }
                            sx={{
                              minHeight: 45,
                              width: open ? "100%" : "70%",
                              justifyContent: open ? "initial" : "center",
                              marginLeft: open ? 0 : 1.2,
                            }}>
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                              }}>
                              {listOpen[item.text]
                                ? location.pathname.substring(
                                    1,
                                    location.pathname.lastIndexOf("/")
                                  ) ===
                                  item.path.substring(
                                    1,
                                    item.path.lastIndexOf("/")
                                  )
                                  ? item.iconActive
                                  : item.icon
                                : location.pathname === item.path
                                ? item.iconActive
                                : item.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.text}
                              sx={{ opacity: open ? 1 : 0 }}
                              primaryTypographyProps={{
                                fontSize: 13,
                                fontWeight: "medium",
                                color: listOpen[item.text]
                                  ? location.pathname.substring(
                                      1,
                                      location.pathname.lastIndexOf("/")
                                    ) ===
                                      item.path.substring(
                                        1,
                                        item.path.lastIndexOf("/")
                                      ) && "primary"
                                  : location.pathname === item.path &&
                                    "primary",
                              }}
                            />
                            {item.childs.length > 0 &&
                              (listOpen[item.text] ? (
                                <ArrowDropUpRoundedIcon
                                  sx={{
                                    color: listOpen[item.text]
                                      ? location.pathname.substring(
                                          1,
                                          location.pathname.lastIndexOf("/")
                                        ) ===
                                        item.path.substring(
                                          1,
                                          item.path.lastIndexOf("/")
                                        )
                                        ? primaryColor
                                        : secondaryColor
                                      : secondaryColor,
                                    ...(!open && { display: "none" }),
                                  }}
                                  fontSize="small"
                                />
                              ) : (
                                <ArrowDropDownRoundedIcon
                                  sx={{
                                    color: listOpen[item.text]
                                      ? location.pathname.substring(
                                          1,
                                          location.pathname.lastIndexOf("/")
                                        ) ===
                                          item.path.substring(
                                            1,
                                            item.path.lastIndexOf("/")
                                          ) && primaryColor
                                      : secondaryColor,
                                    ...(!open && { display: "none" }),
                                  }}
                                  fontSize="small"
                                />
                              ))}
                          </ListItemButton>
                          <div
                            className={`${
                              item.childs.length && "mx-4 border-l-2 mt-1"
                            }`}>
                            {item.childs.map((child, index1) => (
                              <div key={index1}>
                                {open && (
                                  <Collapse
                                    in={listOpen[item.text]}
                                    timeout="auto"
                                    unmountOnExit>
                                    <List component="div" disablePadding>
                                      <ListItemButton
                                        className={`${
                                          location.pathname === child.path
                                            ? "active"
                                            : null
                                        } left-6 w-[155px]`}
                                        sx={{ mt: 0.7 }}
                                        onClick={() =>
                                          handleClickForChild(child)
                                        }>
                                        <ListItemText
                                          primary={child.text}
                                          primaryTypographyProps={{
                                            fontSize: 13,
                                            fontWeight: "medium",
                                            color:
                                              location.pathname === child.path
                                                ? "primary"
                                                : darkGray,
                                          }}
                                          className="sm:ml-0 ml-1"
                                        />
                                      </ListItemButton>
                                    </List>
                                  </Collapse>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })}
            </div>
            <div className="profile-container">
              <div className="d-flex flex-row align-items-center mx-[16px] me-2">
                <div>
                  <AccountMenu />
                </div>
                <div className="ml-[5px] w-[150px]">
                  {open && (
                    <>
                      <Typography
                        fontSize={13}
                        fontWeight="medium"
                        color={dark}>
                        {user ? user.username : ""}
                      </Typography>
                      <Typography fontSize={10} color={dark}>
                        {user ? user.email : ""}
                      </Typography>
                    </>
                  )}
                </div>
                <div className="absolute right-1">
                  <Link to="/profile">
                    {user.role !== "super-admin" && open && (
                      <SettingsRoundedIcon fontSize="small" sx={iconStyling1} />
                    )}
                  </Link>
                </div>
              </div>

              <div className="row align-items-center mx-[25px]">
                <div className="col-2 p-1">
                  <Switch checked={open} onClick={handleDrawerToggle} />
                </div>
                <div className="col-8">
                  {open && (
                    <Typography fontSize={13} color={dark}>
                      Collapse Sidebar
                    </Typography>
                  )}
                </div>
              </div>
            </div>
          </List>
        </Drawer>

        <div
          style={{
            marginLeft: open ? 240 : `calc(${theme.spacing(7)} + 20px)`,
          }}>
          {children}
          <Outlet />
        </div>
      </Box>
    )
  );
};

export default Layout;
