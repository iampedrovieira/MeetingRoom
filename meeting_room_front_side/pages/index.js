import { useEffect } from "react";
import { useRouter } from "next/router";
import cookies from "next-cookies";
import jwt from "jsonwebtoken";
import {sessionValidation} from "@/libs/Session.ts"
import LoadingPage from "./components/LoadingPage";

export default function Home({user}) {
  const router = useRouter();


  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/reservation/" + user.defaultOffice)
    }
  });

  return <LoadingPage />;
}

export async function getServerSideProps(context) {
  //Get token from cookies
  const { token } = cookies(context);
  const result = await sessionValidation(token);

  if (result) {
    const json_user = jwt.decode(token);

    return {
      props: {
        user: json_user,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}