package am.ik.home.account;

import java.net.URI;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;

import am.ik.home.client.user.UaaUser;

@RestController
@RequestMapping(path = "v1/accounts/me")
public class MeController {
	private final UaaUser uaaUser;
	private final RestTemplate restTemplate;
	private final AccountRepository accountRepository;

	public MeController(UaaUser uaaUser, RestTemplate restTemplate,
			AccountRepository accountRepository) {
		this.uaaUser = uaaUser;
		this.restTemplate = restTemplate;
		this.accountRepository = accountRepository;
	}

	@RequestMapping
	Object translateMe(RequestEntity<Object> req, UriComponentsBuilder builder)
			throws Exception {
		if (HttpMethod.POST.equals(req.getMethod())) {
			return restTemplate.exchange(createPostRequest(req), JsonNode.class);
		}
		else {
			String memberId = uaaUser.getUserId();
			return accountRepository.findByMemberId(memberId).map(Account::getAccountId)
					.map(accountId -> createMeRequest(req, accountId))
					.map(next -> restTemplate.exchange(next, JsonNode.class))
					.orElseGet(() -> ResponseEntity.notFound().build());
		}
	}

	RequestEntity<Object> createMeRequest(RequestEntity<Object> req, String accountId) {
		return new RequestEntity<>(req.getBody(), headers(req), req.getMethod(),
				URI.create(req.getUrl().toString().replace("/me", "/" + accountId)));
	}

	RequestEntity<Object> createPostRequest(RequestEntity<Object> req) {
		return new RequestEntity<>(req.getBody(), headers(req), HttpMethod.POST,
				URI.create(req.getUrl().toString().replace("/me", "")));
	}

	HttpHeaders headers(RequestEntity<Object> req) {
		HttpHeaders headers = new HttpHeaders();
		headers.putAll(req.getHeaders());
		headers.add("X-From-Me", "true");
		return headers;
	}
}
