package kr.or.nextit.groupware.weather;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value( "${weather.api.key}")
    private String apiKey;

    private final String apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s";

    private final RestTemplate restTemplate = new RestTemplate();

    public WeatherVO getWeatherCityName(String cityName) {
        String url = String.format(apiUrl, cityName, apiKey);
        return restTemplate.getForObject(url, WeatherVO.class);
    }
}
