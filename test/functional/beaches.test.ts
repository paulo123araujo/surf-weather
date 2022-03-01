import { Beach } from '@src/models/beach';
describe('Beaches functional tests', () => {
  beforeAll(async () => await Beach.deleteMany({}));

  describe('When creating a beach', () => {
    test('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    test('should throw 422 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"',
      });
    });

    test('should return 500 when there is any error other than validation error', async () => {
      jest
        .spyOn(Beach.prototype, 'save')
        .mockRejectedValueOnce('fail to create beach');
      const newBeach = {
        lat: -33.792726,
        lng: 46.43243,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Internal Server Error',
      });
    });
  });
});
