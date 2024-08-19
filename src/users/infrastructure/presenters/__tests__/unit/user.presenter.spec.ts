import { instanceToPlain } from "class-transformer";
import { UserPresenter } from "../../user.presenter";

describe('UserPresenter unit tests', () => {
  const createdAt = new Date();
  let props = {
    id: '8c72fce5-7f67-41b7-a1a8-4892ed6d8bf5',
    name: 'Test name',
    email: 'a@a.com',
    password: 'fake',
    createdAt,
  }

  let sut: UserPresenter;

  beforeEach(() => {
    sut = new UserPresenter(props);
  });

  describe('constructor', () => {
    it('should set values', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toEqual(props.createdAt);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        id: '8c72fce5-7f67-41b7-a1a8-4892ed6d8bf5',
        name: 'Test name',
        email: 'a@a.com',
        createdAt: createdAt.toISOString(),
      });
    });
  });
});