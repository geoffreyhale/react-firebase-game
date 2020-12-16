import Button from 'react-bootstrap/Button';

const UserAuth = ({ user, login, logout }) => {
  if (user) {
    return (
      <>
        <img src={user.photoURL} alt="user photo" style={{ height: 48 }} />
        <Button variant="outline-danger" size="sm" onClick={logout}>
          Log Out
        </Button>
      </>
    );
  }
  return (
    <Button variant="primary" onClick={login}>
      Log In
    </Button>
  );
};

export default UserAuth;
