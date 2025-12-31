import { ThemeProvider, MessageProvider } from "@andrewmclachlan/moo-ds";

/**
 * Decorator for table header components (th elements)
 */
export const TableDecorator = (Story: React.ComponentType) => (
    <div className="dark" data-bs-theme="dark">
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <Story />
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Sample Data</td>
                </tr>
            </tbody>
        </table>
    </div>
);

/**
 * Decorator for table body components (tr elements)
 */
export const TableBodyDecorator = (Story: React.ComponentType) => (
    <div className="dark" data-bs-theme="dark">
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                    <th>Column 3</th>
                </tr>
            </thead>
            <tbody>
                <Story />
            </tbody>
        </table>
    </div>
);

/**
 * Decorator for components that need ThemeProvider
 */
export const ThemeDecorator = (Story: React.ComponentType) => (
    <ThemeProvider>
        <Story />
    </ThemeProvider>
);

/**
 * Decorator for components that need MessageProvider
 */
export const MessageDecorator = (Story: React.ComponentType) => (
    <MessageProvider>
        <Story />
    </MessageProvider>
);

/**
 * Decorator for nav items
 */
export const NavDecorator = (Story: React.ComponentType) => (
    <nav className="nav flex-column">
        <Story />
    </nav>
);
