import { nanoid } from 'nanoid';

const nonceGenerator = (): string => nanoid();

export default nonceGenerator;
