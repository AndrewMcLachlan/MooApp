/**
 * Test utilities for moo-app
 *
 * @example
 * ```tsx
 * import { render, screen } from '../test-utils';
 * import { createAxiosMock, createAxiosResponse } from '../test-utils';
 *
 * it('fetches data', async () => {
 *   const httpClient = createAxiosMock();
 *   httpClient.get.mockResolvedValue(createAxiosResponse({ name: 'Test' }));
 *
 *   render(<MyComponent />, { httpClient });
 *
 *   await waitFor(() => {
 *     expect(screen.getByText('Test')).toBeInTheDocument();
 *   });
 * });
 * ```
 */

export * from './mocks';
export * from './render';
