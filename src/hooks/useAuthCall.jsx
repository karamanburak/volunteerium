import { useDispatch } from "react-redux"
import {
  fetchFail,
  fetchStart,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
} from "../features/authSlice"
import { useNavigate } from "react-router-dom"
import useAxios, { axiosWithPublic } from "./useAxios"
import toastNotify from "../utils/toastNotify"
import { getLoginRedirectLink } from "../pages/GoogleAuthSuccess"
import { translations } from "../locales/translations"
import { t } from "i18next"

const useAuthCall = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { axiosWithToken } = useAxios()

  const onRecaptchaVerify = async (token, values, type) => {
    if (!token) {
      toastNotify("error", t(translations.toastify.verifySecureError))
      return
    }

    try {
      const { data } = await axiosWithPublic.post("auth/verify-recaptcha", {
        token,
      })
      if (!data.error) {
        // if succeed
        if (type === "login") {
          login(values)
        } else if (type === "register") {
          register(values)
        }
      }
    } catch (error) {
      toastNotify("error", error.response.data.message)
    }
  }

  const register = async (userInfo) => {
    dispatch(fetchStart())
    try {
      const { data } = await axiosWithPublic.post("auth/register", userInfo)
      dispatch(registerSuccess())
      navigate("/register/success")
      toastNotify("success", data.message)
    } catch (error) {
      dispatch(fetchFail())
      toastNotify("error", error.response.data.message)
    }
  }

  const login = async (userInfo) => {
    dispatch(fetchStart())
    try {
      const { data } = await axiosWithPublic.post("auth/login", userInfo)
      dispatch(loginSuccess(data))
      console.log(data)
      const link = getLoginRedirectLink(data.user)

      setTimeout(() => {
        navigate(link)
        if (link === "/") toastNotify("success", data.message)
      }, 0)
    } catch (error) {
      dispatch(fetchFail())
      toastNotify("error", error.response.data.message)
    }
  }

  const logout = async (showNotify) => {
    dispatch(fetchStart())
    try {
      const { data } = await axiosWithToken.get("auth/logout")
      dispatch(logoutSuccess())
      navigate("/")
      showNotify && toastNotify("success", data.message)
    } catch (error) {
      dispatch(fetchFail())
      toastNotify("error", error.response.data.message)
    }
  }

  const verifyEmail = async (verifyEmailToken) => {
    dispatch(fetchStart())
    try {
      const { data } = await axiosWithPublic.post("/auth/verify-email", {
        verifyEmailToken,
      })
      dispatch(loginSuccess(data))

      setTimeout(() => {
        navigate("/verify-email/success")
      }, 0)
    } catch (error) {
      dispatch(fetchFail())
      toastNotify("error", error.response.data.message)
    }
  }

  const authWithGoogle = async () => {
    window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, "_self")
  }

  return { register, login, logout, verifyEmail, authWithGoogle, onRecaptchaVerify }
}

export default useAuthCall
