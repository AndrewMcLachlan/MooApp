import "../../../node_modules/react-toastify/dist/ReactToastify.css";
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
            theme={(!theme && !defaultTheme) ? "dark" : theme.theme === "" ? defaultTheme.theme : theme.theme.startsWith("dark") ? "dark" : "light"}
            transition={Slide}
        />
    );
}
