package java_web.be.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "room_availability",
        uniqueConstraints = @UniqueConstraint(columnNames = {"room_type_id", "date"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RoomAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long availabilityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    @JsonIgnore
    private RoomType roomType;

    @NotNull
    private LocalDate date;

    @NotNull
    private Integer availableRooms;
}
