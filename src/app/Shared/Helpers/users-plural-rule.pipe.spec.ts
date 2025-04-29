import { UsersPluralRulePipe } from './users-plural-rule.pipe';

describe('UsersPluralRulePipe', () => {
  it('create an instance', () => {
    const pipe = new UsersPluralRulePipe();
    expect(pipe).toBeTruthy();
  });
});
