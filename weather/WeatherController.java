package kr.or.nextit.groupware.weather;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WeatherController {

    private final WeatherService weatherService;
    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/weather")
    public WeatherVO getWeather(@RequestParam("city") String city) {
        return weatherService.getWeatherCityName(city);
    }

}
