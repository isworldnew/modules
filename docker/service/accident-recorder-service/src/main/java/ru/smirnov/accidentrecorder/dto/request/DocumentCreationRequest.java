package ru.smirnov.accidentrecorder.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data @AllArgsConstructor @NoArgsConstructor
public class DocumentCreationRequest {

    @NotNull @Positive
    private Long responseId;

    /* TODO: добавить валидаций на объём и тип данных */
    private MultipartFile document;

}
