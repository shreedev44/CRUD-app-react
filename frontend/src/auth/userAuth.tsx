import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


const isTokenExpired = (token: string) => {
    if(!token) {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwtDecode(token)
    return decoded.exp * 1000 < Date.now();
}

export async function refreshAccessToken () {
    if(Cookies.get('refreshToken')) {
        try{
            const response = await fetch('http://localhost:3000/refresh-token', {
                method: "GET",
                credentials: "include",
                headers: {
                    "Cookie": `refreshToken=${Cookies.get('refreshToken')}`
                }
            });
            const data = await response.json()
            if(response.status === 403) {
                return null;
            } else {
                return data.newAccessToken

            }
        } catch(error) {
            console.log(error)
            return null
        }
    } else {
        return null
    }
}


export async function UserAuth(accessToken: string) {
    if(isTokenExpired(accessToken)){
        const newAccessToken = await refreshAccessToken()
        if(newAccessToken) {
            return newAccessToken
        } else {
            return null;
        }
    } else {
        return accessToken;
    }
}