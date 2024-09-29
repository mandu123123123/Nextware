//package kr.or.nextit.groupware.config;
//
//import jakarta.servlet.DispatcherType;
//import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http.csrf((csrfConfig) -> csrfConfig.disable())
//                .headers((headersConfig) ->
//                        headersConfig.frameOptions(frameOptionsConfig ->
//                                frameOptionsConfig.disable()))
//                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
//                        .requestMatchers("/static/**", "/manifest.json", "/favicon.ico", "/index.html").permitAll()
//                        .requestMatchers("/","/login","/forgot-password","/select-auth","/create-account","/change-password").permitAll()
//                        .anyRequest().permitAll())
//                .formLogin(login -> login
//                        .loginPage("/login")
//                        .defaultSuccessUrl("/app/dashboard", true)	// 성공 시 dashboard로
//                        .permitAll())
//                .logout(logout -> logout.permitAll());
//            return http.build();
//    }
//}
