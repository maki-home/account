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
@Table(name = "phone")
@DynamicUpdate
public class Phone implements Serializable {
	@Id
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@GeneratedValue(generator = "uuid")
	@Column(columnDefinition = "varchar(36)")
	private String phoneId;
	@NotEmpty
	@Size(max = 128)
	private String phoneNumber;
	@NotEmpty
	@Size(max = 128)
	private String purpose;
}
