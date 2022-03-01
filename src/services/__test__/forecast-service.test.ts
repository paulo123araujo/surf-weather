import { StormGlassClient } from '@src/clients';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import {
  ForecastProcessingInternalError,
  ForecastService,
} from '@src/services/forecast-service';
import { Beach, BeachPosition } from '@src/models/beach';

jest.mock('@src/clients/storm-glass-client.ts');

describe('Forecast Service', () => {
  const mockedClient = new StormGlassClient() as jest.Mocked<StormGlassClient>;

  test('should return the forecast fos a list of beaches', async () => {
    mockedClient.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponseFixture,
    );

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id',
      },
    ];

    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 3.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 0.47,
            windDirection: 299.45,
            windSpeed: 100,
          },
        ],
      },
      {
        time: '2020-04-26T01:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T01:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100,
          },
        ],
      },
      {
        time: '2020-04-26T02:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 182.56,
            swellHeight: 0.28,
            swellPeriod: 3.44,
            time: '2020-04-26T02:00:00+00:00',
            waveDirection: 232.86,
            waveHeight: 0.46,
            windDirection: 321.5,
            windSpeed: 100,
          },
        ],
      },
    ];

    const forecastService = new ForecastService(mockedClient);
    const beachesWithRating = await forecastService.processForecastForBeaches(
      beaches,
    );

    expect(beachesWithRating).toEqual(expectedResponse);
  });

  test('should return an empty list when the beaches array is empty', async () => {
    const forecastService = new ForecastService();
    const response = await forecastService.processForecastForBeaches([]);

    expect(response).toEqual([]);
  });

  test('should throw internal processing error when something goes wrong during the rating process', async () => {
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id',
      },
    ];

    mockedClient.fetchPoints.mockRejectedValue('Error fetching data');

    const forecastService = new ForecastService(mockedClient);

    await expect(
      forecastService.processForecastForBeaches(beaches),
    ).rejects.toThrow(ForecastProcessingInternalError);
  });
});
