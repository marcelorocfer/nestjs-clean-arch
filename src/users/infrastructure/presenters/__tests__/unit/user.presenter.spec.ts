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

  describe('constructor', () => {
    it('should be defined', () => {
      const sut = new UserPresenter(props);
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toEqual(props.createdAt);
    });
  });
});