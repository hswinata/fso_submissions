const Notification = ({ notificationType, notificationMessage }) => {
  if (notificationMessage === null) return null;

  const greenStyle = {
    color: "green",
    fontSize: 24,
    border: "3px solid green",
    padding: "5px",
    marginBottom: "5px",
  };

  const errorStyle = {
    color: "red",
    fontSize: 24,
    border: "3px solid red",
    padding: "5px",
    marginBottom: "5px",
  };

  const notificationStyle = () => {
    return notificationType === "notification" ? greenStyle : errorStyle;
  };

  return <div style={notificationStyle()}>{notificationMessage}</div>;
};

export default Notification;
