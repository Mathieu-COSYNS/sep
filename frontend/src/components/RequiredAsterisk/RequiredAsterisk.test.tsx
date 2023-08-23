import { render } from '@/utils/test-utils';
import RequiredAsterisk from './RequiredAsterisk';

test('renders without crashing', async () => {
  const { baseElement, findAllByText } = render(<RequiredAsterisk />);
  expect(baseElement).toBeDefined();
  const asterisk = await findAllByText('*');
  expect(asterisk.length).toEqual(1);
});
