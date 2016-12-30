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
@Table(name = "account_attribute")
@DynamicUpdate
public class Attribute implements Serializable {
	@Id
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@GeneratedValue(generator = "uuid")
	@Column(columnDefinition = "varchar(36)")
	private String attributeId;
	@NotEmpty
	@Size(max = 255)
	private String attributeName;
	@Size(max = 255)
	private String attributeValue;
}
