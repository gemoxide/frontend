import React from "react";

// Dashboard component - visible to all users
export const DashboardComponent = () => {
  return React.createElement(
    "div",
    { className: "p-6" },
    React.createElement(
      "h1",
      { className: "text-2xl font-bold text-white" },
      "Dashboard"
    ),
    React.createElement(
      "p",
      { className: "text-white" },
      "This is the main dashboard - visible to all users!"
    )
  );
};

// For User component - only visible to users with "User" role
export const ForUserComponent = () => {
  return React.createElement(
    "div",
    { className: "p-6" },
    React.createElement(
      "h1",
      { className: "text-2xl font-bold text-white" },
      "For User"
    ),
    React.createElement(
      "p",
      { className: "text-white" },
      "This page is only visible to users with 'User' role!"
    )
  );
};

// For Admin component - only visible to users with "Administrator" role
export const ForAdminComponent = () => {
  return React.createElement(
    "div",
    { className: "p-6" },
    React.createElement(
      "h1",
      { className: "text-2xl font-bold text-white" },
      "For Admin"
    ),
    React.createElement(
      "p",
      { className: "text-white" },
      "This page is only visible to users with 'Administrator' role!"
    )
  );
};
