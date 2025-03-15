package ssiosk.ssiosk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import ssiosk.ssiosk.config.CorsConfig;

@EnableJpaAuditing
@SpringBootApplication
@Import(CorsConfig.class)
public class SsioskApplication {

	public static void main(String[] args) {
		SpringApplication.run(SsioskApplication.class, args);
	}

}
