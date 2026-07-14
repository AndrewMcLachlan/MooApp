import "react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer } from "react-toastify";
import { useTheme } from "../providers";

export const Notifications: React.FC = () => {

    const { defaultTheme, theme } = useTheme();

    // Resolve the active theme, falling back to defaultTheme when there is no
    // active theme or it is the "System" ("") entry. A dark default now
    // correctly yields a dark toast instead of always falling back to light.
    const resolvedTheme = (theme && theme.theme !== "") ? theme.theme : defaultTheme?.theme;
    const toastTheme = resolvedTheme?.startsWith("dark") ? "dark" : "light";

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
            theme={toastTheme}
            transition={Slide}
        />
    );
}
