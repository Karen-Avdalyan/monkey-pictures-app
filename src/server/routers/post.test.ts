import type { inferProcedureInput } from '@trpc/server';
import { describe, it, beforeAll } from 'vitest';
import { createContextInner } from '../context';
import type { AppRouter } from './_app';
import { createCaller } from './_app';

describe('Add monkey picture cases', () => {
  let ctx;
  let caller: ReturnType<typeof createCaller>;

  beforeAll(async () => {
    ctx = await createContextInner({});
    caller = createCaller(ctx);
  });

  it('Successful', async () => {
    const input: inferProcedureInput<AppRouter['monkeyPicture']['add']> = {
      id: '11111111-1111-1111-1111-111111111111',
      url: 'hello test',
      description: 'hello test',
    };

    const monkeyPicture = await caller.monkeyPicture.add(input);

    expect(monkeyPicture.id).equal(input.id);
    expect(monkeyPicture.url).equal(input.url);
    expect(monkeyPicture.description).equal(input.description);

    await caller.monkeyPicture.removeById({ id: monkeyPicture.id });
  });

  it('Failing - URL failing validation', async () => {
    const input: inferProcedureInput<AppRouter['monkeyPicture']['add']> = {
      id: '11111111-1111-1111-1111-111111111111',
      url: 'no',
      description: 'hello test',
    };

    // const monkeyPicture = caller.monkeyPicture.add(input);
    await expect(() => caller.monkeyPicture.add(input)).rejects.toThrowError(`[
  {
    "code": "too_small",
    "minimum": 3,
    "type": "string",
    "inclusive": true,
    "exact": false,
    "message": "String must contain at least 3 character(s)",
    "path": [
      "url"
    ]
  }
]`);
  });

  it('Failing - Description failing validation', async () => {
    const input: inferProcedureInput<AppRouter['monkeyPicture']['add']> = {
      id: '11111111-1111-1111-1111-111111111111',
      url: 'hello test',
      description: 'no',
    };

    await expect(() => caller.monkeyPicture.add(input)).rejects.toThrowError(`[
  {
    "code": "too_small",
    "minimum": 3,
    "type": "string",
    "inclusive": true,
    "exact": false,
    "message": "String must contain at least 3 character(s)",
    "path": [
      "description"
    ]
  }
]`);
  });
});
