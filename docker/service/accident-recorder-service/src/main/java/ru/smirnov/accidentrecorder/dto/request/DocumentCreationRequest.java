package ru.smirnov.accidentrecorder.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import ru.smirnov.accidentrecorder.validation.annotation.DocumentTypeLabel;

@Data @AllArgsConstructor @NoArgsConstructor
public class DocumentCreationRequest {

    @NotNull @Positive
    private Long responseId;

    @NotNull // ещё валидация объёма файла и типа данных
    private MultipartFile document;

    @NotBlank @DocumentTypeLabel
    private String documentType;
}
