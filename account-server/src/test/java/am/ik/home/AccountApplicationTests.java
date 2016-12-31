package am.ik.home;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
		"spring.datasource.url=jdbc:h2:mem:test;DB_CLOSE_ON_EXIT=FALSE" })
@Ignore
public class AccountApplicationTests {

	@Test
	public void contextLoads() {
	}

}
