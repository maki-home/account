package am.ik.home;

import java.io.IOException;

import org.apache.catalina.filters.RequestDumperFilter;
import org.springframework.aop.Advisor;
import org.springframework.aop.aspectj.AspectJExpressionPointcut;
import org.springframework.aop.support.DefaultPointcutAdvisor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
import org.springframework.hateoas.hal.Jackson2HalModule;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.interceptor.DefaultTransactionAttribute;
import org.springframework.transaction.interceptor.NameMatchTransactionAttributeSource;
import org.springframework.transaction.interceptor.TransactionInterceptor;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.annotation.SessionScope;

import com.fasterxml.jackson.databind.ObjectMapper;

import am.ik.home.account.Account;
import am.ik.home.client.user.UaaUser;

@SpringBootApplication
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableZuulProxy
public class AccountApplication {

	public static void main(String[] args) {

		SpringApplication.run(AccountApplication.class, args);
	}

	@Profile("!cloud")
	@Bean
	RequestDumperFilter requestDumperFilter() {
		return new RequestDumperFilter();
	}

	@Bean
	Jackson2ObjectMapperBuilderCustomizer objectMapperBuilderCustomizer() {
		return builder -> {
			builder.modulesToInstall(new Jackson2HalModule());
		};
	}

	@Bean
	RestTemplate restTemplate() {
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.setErrorHandler(new ResponseErrorHandler() {
			@Override
			public boolean hasError(ClientHttpResponse response) throws IOException {
				return false;
			}

			@Override
			public void handleError(ClientHttpResponse response) throws IOException {

			}
		});
		return restTemplate;
	}

	@Bean
	@SessionScope
	UaaUser uaaUser(ObjectMapper objectMapper) {
		return new UaaUser(objectMapper);
	}

	@Configuration
	@Order(10)
	@EnableOAuth2Sso
	static class WebSecurityConfig extends WebSecurityConfigurerAdapter {
		@Override
		public void configure(HttpSecurity http) throws Exception {
			http.antMatcher("/**").authorizeRequests().anyRequest().authenticated().and()
					.csrf()
					.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
		}
	}

	@Configuration
	@EnableResourceServer
	static class OAuth2ResourceConfig extends ResourceServerConfigurerAdapter {
		@Override
		public void configure(HttpSecurity http) throws Exception {
			http.sessionManagement()
					.sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
					.antMatcher("/v1/**").authorizeRequests()
					.antMatchers(HttpMethod.GET, "/v1/accounts/**")
					.access("#oauth2.hasScope('account.read') or #oauth2.hasScope('admin.read')")
					.antMatchers(HttpMethod.POST, "/v1/accounts/**")
					.access("#oauth2.hasScope('account.write') or #oauth2.hasScope('admin.write')")
					.antMatchers(HttpMethod.PUT, "/v1/accounts/**")
					.access("#oauth2.hasScope('account.write') or #oauth2.hasScope('admin.write')")
					.antMatchers(HttpMethod.DELETE, "/v1/accounts/**")
					.access("#oauth2.hasScope('account.write') or #oauth2.hasScope('admin.write')");
		}
	}

	@Configuration
	static class RestConfig extends RepositoryRestConfigurerAdapter {
		@Override
		public void configureRepositoryRestConfiguration(
				RepositoryRestConfiguration config) {
			config.exposeIdsFor(Account.class);
		}
	}

	// Workarround http://stackoverflow.com/a/30713264/5861829
	@Configuration
	static class TxConfig {
		private final PlatformTransactionManager transactionManager;

		public TxConfig(PlatformTransactionManager transactionManager) {
			this.transactionManager = transactionManager;
		}

		@Bean
		TransactionInterceptor txAdvice() {
			NameMatchTransactionAttributeSource source = new NameMatchTransactionAttributeSource();
			source.addTransactionalMethod("post*", new DefaultTransactionAttribute());
			source.addTransactionalMethod("put*", new DefaultTransactionAttribute());
			source.addTransactionalMethod("delete*", new DefaultTransactionAttribute());
			source.addTransactionalMethod("patch*", new DefaultTransactionAttribute());
			return new TransactionInterceptor(transactionManager, source);
		}

		@Bean
		Advisor txAdvisor() {
			AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
			pointcut.setExpression(
					"execution(* org.springframework.data.rest.webmvc.RepositoryEntityController.*(..))");
			return new DefaultPointcutAdvisor(pointcut, txAdvice());
		}
	}
}
