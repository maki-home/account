package am.ik.home.account;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.method.P;
import org.springframework.security.access.prepost.PreAuthorize;

public interface AccountRepository extends JpaRepository<Account, String> {

	@PreAuthorize("hasRole('ADMIN') or #account.memberId == principal")
	Account save(@P("account") Account account);

	@PreAuthorize("hasRole('ADMIN') or #account.memberId == principal")
	void delete(@P("account") Account account);

	Optional<Account> findByMemberId(@Param("memberId") String memberId);
}
