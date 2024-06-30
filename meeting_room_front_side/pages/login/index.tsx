import styles from "./login.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import Header from '../components/Header'
import {login} from "@/libs/Session"
import jwt from "jsonwebtoken";
import { GetServerSideProps } from "next";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  async function handleLogin() {
    document.cookie = "token =";
    //Send data to server-side
    const result = await login(username,password)
    
    if(result.success){
      document.cookie = "token ="+result.token
      const json = jwt.decode(result.token.toString(),{json:true});
      router.push("/reservation/"+ json.defaultOffice);
      
    }else{
      alert("Login Fail");
    }
    
  }

  return (
    <div className={styles.grid_container}>

      <Head>
        <title>Meeting Room- Login</title>
      </Head>
      
      <Header className={styles.header}/>

      <div className={styles.Container}>
        <div className={styles.form} >
          <div className={styles.inputs}>
            <div className="svgs">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#444444" height="26px">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <input type="text" name="username" id="username" placeholder="Username" value={username} onChange={(u) => setUsername(u.target.value)} />
          </div>

          <div className={styles.inputs}>
            <div className="svgs">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#444444" height="26px">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <input type="password" name="password" id="password" placeholder="Password" value={password} onChange={(p) => setPassword(p.target.value)} />
          </div>
          
          <button onClick={async () => { await handleLogin(); }}>LOGIN</button>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps:GetServerSideProps= async (context)=> {
  return {
    //os users vao receber os valores de data
    props: {},
  }
}

export default Login;
