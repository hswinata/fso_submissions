const Notification = ({ notification }) => {
  if (notification === null) return null;

  const notificationStyle = {
    color: "green",
    fontSize: 24,
    border: "3px solid green",
    padding: "5px",
    marginBottom: "5px",
  };

  return <div style={notificationStyle}>{notification}</div>;
};

export default Notification;
