import { setupServer } from 'msw/node';
import { handlers } from './specs/mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())
