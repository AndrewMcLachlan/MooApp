import "~/react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer } from "react-toastify";
import { useTheme } from "../providers";

export const Notifications: React.FC = () => {

    const { defaultTheme, theme } = useTheme();

    return (
        <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme.theme === "" ? defaultTheme.theme : theme.theme === "dark" ? "dark" : "light"}
            transition={Slide}
        />
    );
}
