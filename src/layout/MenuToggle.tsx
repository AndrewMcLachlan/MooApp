import { IconButton, IconLinkButton } from "../components";
import HamburgerMenu from "../assets/hamburger-menu.svg";

export const MenuToggle: React.FC<MenuToggleProps> = ({ onClick }) => {
    return (
        <button aria-controls="sidebar" className="btn btn-hamburger" onClick={onClick}>
            <div>
                <svg id="SVGRoot" width="32" height="32" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                        <path d="m6.4484 22.5h19.103" />
                        <path d="m6.4892 16h19.021" />
                        <path d="m6.4892 9.5h19.021" />
                    </g>
                </svg>
            </div>
        </button>
    );
};

export interface MenuToggleProps {
    onClick: () => void;
}
