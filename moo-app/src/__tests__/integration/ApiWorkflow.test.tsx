import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HttpClientContext } from '../../providers/HttpClientProvider';
import { useApiGet } from '../../services/useApiGet';
import { AxiosInstance } from 'axios';


interface User {
  id: number;
  name: string;
  email: string;
}

// Create a wrapper with all required providers
const createWrapper = (mockHttpClient: Record<string, unknown>) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <HttpClientContext.Provider value={mockHttpClient as unknown as AxiosInstance}>
        {children}
      </HttpClientContext.Provider>
    </QueryClientProvider>
  );
};

describe('API Workflow Integration', () => {
  const mockHttpClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetch and display data workflow', () => {
    const UserList = () => {
      const { data, isLoading, error } = useApiGet<User[]>(['users'], '/api/users');

      if (isLoading) return <div data-testid="loading">Loading...</div>;
      if (error) return <div data-testid="error">Error: {error.message}</div>;

      return (
        <ul data-testid="user-list">
          {data?.map((user) => (
            <li key={user.id} data-testid={`user-${user.id}`}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      );
    };

    it('displays loading state while fetching', async () => {
      mockHttpClient.get.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
      );

      render(<UserList />, { wrapper: createWrapper(mockHttpClient) });

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('displays fetched data', async () => {
      const users: User[] = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ];
      mockHttpClient.get.mockResolvedValue({ data: users });

      render(<UserList />, { wrapper: createWrapper(mockHttpClient) });

      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
        expect(screen.getByTestId('user-1')).toHaveTextContent('John');
        expect(screen.getByTestId('user-2')).toHaveTextContent('Jane');
      });
    });

    it('displays error state on fetch failure', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));

      render(<UserList />, { wrapper: createWrapper(mockHttpClient) });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      });
    });

    it('calls API with correct endpoint', async () => {
      mockHttpClient.get.mockResolvedValue({ data: [] });

      render(<UserList />, { wrapper: createWrapper(mockHttpClient) });

      await waitFor(() => {
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/users');
      });
    });

    it('handles empty data array', async () => {
      mockHttpClient.get.mockResolvedValue({ data: [] });

      render(<UserList />, { wrapper: createWrapper(mockHttpClient) });

      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
        expect(screen.queryByTestId('user-1')).not.toBeInTheDocument();
      });
    });
  });

  describe('conditional rendering based on data', () => {
    const UserProfile = ({ userId }: { userId: number }) => {
      const { data, isLoading, error } = useApiGet<User>(
        ['user', userId],
        `/api/users/${userId}`
      );

      if (isLoading) return <div data-testid="loading">Loading profile...</div>;
      if (error) return <div data-testid="error">Failed to load profile</div>;
      if (!data) return <div data-testid="not-found">User not found</div>;

      return (
        <div data-testid="profile">
          <h1 data-testid="name">{data.name}</h1>
          <p data-testid="email">{data.email}</p>
        </div>
      );
    };

    it('displays user profile when data is loaded', async () => {
      const user: User = { id: 1, name: 'Alice', email: 'alice@example.com' };
      mockHttpClient.get.mockResolvedValue({ data: user });

      render(<UserProfile userId={1} />, { wrapper: createWrapper(mockHttpClient) });

      await waitFor(() => {
        expect(screen.getByTestId('profile')).toBeInTheDocument();
        expect(screen.getByTestId('name')).toHaveTextContent('Alice');
        expect(screen.getByTestId('email')).toHaveTextContent('alice@example.com');
      });
    });

    it('uses correct API endpoint with userId', async () => {
      mockHttpClient.get.mockResolvedValue({ data: { id: 42, name: 'Test', email: 'test@test.com' } });

      render(<UserProfile userId={42} />, { wrapper: createWrapper(mockHttpClient) });

      await waitFor(() => {
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/users/42');
      });
    });
  });

  describe('multiple concurrent queries', () => {
    const Dashboard = () => {
      const { data: users, isLoading: usersLoading } = useApiGet<User[]>(['users'], '/api/users');
      const { data: stats, isLoading: statsLoading } = useApiGet<{ total: number }>(
        ['stats'],
        '/api/stats'
      );

      if (usersLoading || statsLoading) {
        return <div data-testid="loading">Loading dashboard...</div>;
      }

      return (
        <div data-testid="dashboard">
          <span data-testid="user-count">{users?.length ?? 0} users</span>
          <span data-testid="total-stats">{stats?.total ?? 0} total</span>
        </div>
      );
    };

    it('handles multiple concurrent API calls', async () => {
      const users: User[] = [
        { id: 1, name: 'User 1', email: 'user1@test.com' },
        { id: 2, name: 'User 2', email: 'user2@test.com' },
      ];
      const stats = { total: 100 };

      mockHttpClient.get.mockImplementation((url: string) => {
        if (url === '/api/users') return Promise.resolve({ data: users });
        if (url === '/api/stats') return Promise.resolve({ data: stats });
        return Promise.reject(new Error('Unknown endpoint'));
      });

      render(<Dashboard />, { wrapper: createWrapper(mockHttpClient) });

      await waitFor(() => {
        expect(screen.getByTestId('dashboard')).toBeInTheDocument();
        expect(screen.getByTestId('user-count')).toHaveTextContent('2 users');
        expect(screen.getByTestId('total-stats')).toHaveTextContent('100 total');
      });
    });
  });
});
