package am.ik.home.account;

import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("cloud")
@RestController
public class AccountController {

	@GetMapping("/account")
	Resource account() {
		return new ClassPathResource("public/index.html");
	}
}
