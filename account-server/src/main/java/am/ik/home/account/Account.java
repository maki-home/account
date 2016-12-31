package am.ik.home.account;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

import lombok.*;

@Entity
@ToString
@EqualsAndHashCode
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PACKAGE)
@Table(name = "account")
@DynamicUpdate
public class Account implements Serializable {
	@Id
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@GeneratedValue(generator = "uuid")
	@Column(columnDefinition = "varchar(36)")
	private String accountId;
	@Convert(converter = Jsr310JpaConverters.LocalDateConverter.class)
	private LocalDate birthDay;
	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinTable(name = "account_addresses", joinColumns = @JoinColumn(name = "account_id"), inverseJoinColumns = @JoinColumn(name = "address_id"))
	private List<Address> addresses;
	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinTable(name = "account_emails", joinColumns = @JoinColumn(name = "account_id"), inverseJoinColumns = @JoinColumn(name = "email_id"))
	private List<Email> emails;
	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinTable(name = "account_phones", joinColumns = @JoinColumn(name = "account_id"), inverseJoinColumns = @JoinColumn(name = "phone_id"))
	private List<Phone> phones;
	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinTable(name = "account_attributes", joinColumns = @JoinColumn(name = "account_id"), inverseJoinColumns = @JoinColumn(name = "attribute_id"))
	private List<Attribute> attributes;
	@Column(columnDefinition = "varchar(36)", unique = true, updatable = false)
	@NotNull
	private String memberId;

	void setAddresses(List<Address> addresses) {
		if (this.addresses == null) {
			this.addresses = addresses;
		}
		else {
			this.addresses.clear();
			this.addresses.addAll(addresses);
		}
	}

	void setEmails(List<Email> emails) {
		if (this.emails == null) {
			this.emails = emails;
		}
		else {
			this.emails.clear();
			this.emails.addAll(emails);
		}
	}

	void setPhones(List<Phone> phones) {
		if (this.phones == null) {
			this.phones = phones;
		}
		else {
			this.phones.clear();
			this.phones.addAll(phones);
		}
	}

	void setAttributes(List<Attribute> attributes) {
		if (this.attributes == null) {
			this.attributes = attributes;
		}
		else {
			this.attributes.clear();
			this.attributes.addAll(attributes);
		}
	}

	void setMemberId(String memberId) {
		this.memberId = memberId;
	}
}
