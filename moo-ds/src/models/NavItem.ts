export interface NavItem {
    id?: string;
    route?: string;
    text: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    image?: React.ReactNode | string;
}