// src/pages/Dashboard.jsx

import React from "react";

import { AppBar, Toolbar, Typography, Button, Box, Paper } from "@mui/material";

import { useNavigate } from "react-router-dom";



const Dashboard = () => {

  const navigate = useNavigate();

  const email = localStorage.getItem("user_email");



  const logout = () => {

    localStorage.removeItem("auth_token");

    localStorage.removeItem("user_email");

    navigate("/login");

  };



  return (

    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>

      <AppBar position="static" color="primary" elevation={2}>

        <Toolbar>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>

            Zilla Panchayat MRF Dashboard

          </Typography>

          <Typography variant="body1" sx={{ mr: 2 }}>

            {email}

          </Typography>

          <Button color="inherit" onClick={logout}>

            Logout

          </Button>

        </Toolbar>

      </AppBar>



      <Box

        sx={{

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          height: "80vh",

        }}

      >

        <Paper

          elevation={4}

          sx={{

            p: 5,

            borderRadius: 3,

            width: "80%",

            maxWidth: 800,

            textAlign: "center",

          }}

        >

          <Typography variant="h5" mb={2}>

            Welcome to the Smart Waste Management System

          </Typography>

          <Typography color="text.secondary">

            You are logged in as <b>{email}</b>.  

            From here, you can view and manage reports, monitor activity,

            and track MRF operations efficiently.

          </Typography>

        </Paper>

      </Box>

    </Box>

  );

};
export default Dashboard;