package am.ik.home.account;

import java.io.Serializable;

import javax.persistence.*;
import javax.validation.constraints.Size;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.NotEmpty;

import lombok.*;

@Entity
@ToString
@EqualsAndHashCode
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PACKAGE)
@Table(name = "address")
@DynamicUpdate
public class Address implements Serializable {
	@Id
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@GeneratedValue(generator = "uuid")
	@Column(columnDefinition = "varchar(36)")
	private String addressId;
	@NotEmpty
	@Size(max = 128)
	private String postcode;
	@NotEmpty
	@Size(max = 255)
	private String address;
	@NotEmpty
	@Size(max = 128)
	private String purpose;
}
