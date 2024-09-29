package kr.or.nextit.groupware.weather;


import lombok.Data;

@Data
public class WeatherVO {
    private String name;
    private Main main;
    private Weather[] weather;

    @Data
    public static class Main{
        private double temp;
        private double temp_max;
        private double temp_min;
        private double feels_like;
        private int humidity;
    }
    @Data
    public static class Weather{
        private String description;
        private String icon;
        private int id;
     }
}
