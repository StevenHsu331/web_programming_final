import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useState, useEffect } from 'react';
import {Container} from 'react-bootstrap';
import LoginInfo from './hooks/LoginInfo'
import Header from './containers/Header'
import Home from './containers/Home';
import LoginForm from './containers/LoginForm';
import './App.css';

function App() {
  const {isLogin, employeeNum, employeeName, id, auth, setIsLogin, setEmployeeNum, setEmployeeName, setId, setAuth} = LoginInfo();
  const [coverShowed, setCoverShowed] = useState(false);

  useEffect(()=>{}, [isLogin])

  return (
    <Container fluid>
      <div className={"cover" + (coverShowed ? "" : " hidden")}></div>
      <Header title={"人資系統"} type={"outer"}></Header>
      {
        isLogin ? <Home id={id} auth={auth} employeeNum={employeeNum} employeeName={employeeName} setCoverShowed={setCoverShowed} setIsLogin={setIsLogin}></Home> : 
        <LoginForm employeeNum={employeeNum} setId={setId} setAuth={setAuth} setIsLogin={setIsLogin} setEmployeeNum={setEmployeeNum} setEmployeeName={setEmployeeName} />
      }
    </Container>
  );
}

export default App;
