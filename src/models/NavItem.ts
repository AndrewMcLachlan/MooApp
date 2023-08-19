export interface NavItem {
    route?: string;
    text: string;
    onClick?: () => void;
    image?: React.ReactNode | string;
}