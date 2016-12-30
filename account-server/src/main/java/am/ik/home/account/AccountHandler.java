package am.ik.home.account;

import javax.servlet.http.HttpServletRequest;

import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

import am.ik.home.client.user.UaaUser;

@RepositoryEventHandler
@Component
public class AccountHandler {
	private final UaaUser uaaUser;
	private final HttpServletRequest httpRequest;

	public AccountHandler(UaaUser uaaUser, HttpServletRequest httpRequest) {
		this.uaaUser = uaaUser;
		this.httpRequest = httpRequest;
	}

	@HandleBeforeCreate
	public void preCreate(Account account) {
		String memberId = uaaUser.getUserId();
		if (account.getMemberId() == null) {
			account.setMemberId(memberId);
		}
	}

	@HandleBeforeSave
	public void preSave(Account account) {
		String memberId = uaaUser.getUserId();
		if (account.getMemberId() == null && httpRequest.getHeader("X-From-Me") != null) {
			account.setMemberId(memberId);
		}
	}
}
