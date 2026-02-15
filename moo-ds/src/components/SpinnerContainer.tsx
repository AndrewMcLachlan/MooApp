import { Spinner } from "./Spinner";

export const SpinnerContainer: React.FC = () => (
    <div className="spinner-container">
        <Spinner animation="border" />
    </div>
);

SpinnerContainer.displayName = "SpinnerContainer";
