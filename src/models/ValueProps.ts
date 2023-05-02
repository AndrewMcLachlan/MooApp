export interface ValueProps<T> {
    value?: T;
    onChange?: (value: T) => void;
}
