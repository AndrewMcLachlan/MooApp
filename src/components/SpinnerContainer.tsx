import "./SpinnerContainer.scss";

import Spinner from "react-bootstrap/Spinner";

export const SpinnerContainer: React.FC = () => (
    <div className="spinner-container">
        <Spinner animation="border" />
    </div>
);